import {
  // Duration,
  RemovalPolicy,
  Stack,
  StackProps,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_iam,
  aws_s3,
  aws_dynamodb,
} from "aws-cdk-lib";
// import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
// import * as route53 from "aws-cdk-lib/aws-route53";
// import * as targets from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";
import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { aws_lambda_nodejs } from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

/**
 * アプリケーションインフラストラクチャのスタック
 */
export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3バケットを作成する
    const sikakuServerlessS3Bucket = new aws_s3.Bucket(
      this,
      "sikakuServerlessS3Bucket",
      {
        removalPolicy: RemovalPolicy.DESTROY,
      }
    );

    // OAIを作成する
    const originAccessIdentity = new aws_cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity",
      {
        comment: "website-distribution-originAccessIdentity",
      }
    );

    // S3バケットポリシーを作成する。OAIからのみアクセス可能とする
    const sikakuServerlessS3BucketPolicyStatement = new aws_iam.PolicyStatement(
      {
        // GETのみ許可
        actions: ["s3:GetObject"],
        effect: aws_iam.Effect.ALLOW,
        principals: [
          new aws_iam.CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
        resources: [`${sikakuServerlessS3Bucket.bucketArn}/*`],
      }
    );

    // S3バケットポリシーにステートメントを追加する
    sikakuServerlessS3Bucket.addToResourcePolicy(
      sikakuServerlessS3BucketPolicyStatement
    );

    // CloudFrontディストリビューションを作成する
    const distribution = new aws_cloudfront.Distribution(this, "Distribution", {
      comment: "sikaku-serverless-distribution",
      defaultRootObject: "index.html",
      defaultBehavior: {
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: aws_cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy:
          aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new aws_cloudfront_origins.S3Origin(sikakuServerlessS3Bucket, {
          originAccessIdentity,
        }),
      },
      priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // ----------------- DynamoDB -----------------

    const post_table = new aws_dynamodb.Table(this, "post-table", {
      tableName: "posts-table", // テーブル名の定義
      partitionKey: {
        //パーティションキーの定義
        name: "post_id", // 投稿ID
        type: aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        // ソートキーの定義
        name: "created_at", // 作成日
        type: aws_dynamodb.AttributeType.STRING,
      },
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST, // オンデマンド請求
      pointInTimeRecovery: false, // デフォルトはfalse(PITRしない)
      removalPolicy: RemovalPolicy.DESTROY, // cdk destroyでDB削除可
    });

    // ----------------- Backend Stack -----------------
    // Lambda関数として、createPost をデプロイする
    const createPost = new aws_lambda_nodejs.NodejsFunction(
      this,
      "createPostHandler",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, "../lambda/posts/createPost.ts"),
        handler: "index.handler", // デプロイするとindex.mjsになるため
        bundling: {
          externalModules: [
            "@aws-sdk/lib-dynamodb",
            "@aws-sdk/client-dynamodb",
          ],
        },
      }
    );

    // Lambda関数として、listPosts をデプロイする
    const listPosts = new aws_lambda_nodejs.NodejsFunction(
      this,
      "listPostsHandler",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, "../lambda/posts/listPosts.ts"),
        handler: "index.handler", // デプロイするとindex.mjsになるため
        bundling: {
          externalModules: [
            "@aws-sdk/lib-dynamodb",
            "@aws-sdk/client-dynamodb",
          ],
        },
      }
    );

    // Lambda関数として、getPost をデプロイする
    const getPost = new aws_lambda_nodejs.NodejsFunction(
      this,
      "getPostHandler",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, "../lambda/posts/getPost.ts"),
        handler: "index.handler", // デプロイするとindex.mjsになるため
        bundling: {
          externalModules: [
            "@aws-sdk/lib-dynamodb",
            "@aws-sdk/client-dynamodb",
          ],
        },
      }
    );

    // createPost関数にDynamoDBの書き込み権限を付与する
    post_table.grantReadWriteData(createPost);
    // listPosts関数にDynamoDBの読み込み権限を付与する
    post_table.grantReadData(listPosts);
    // getPost関数にDynamoDBの読み込み権限を付与する
    post_table.grantReadData(getPost);

    // createPost をAPIGatewayのエンドポイントとして公開する
    const api = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: createPost,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });

    // APIGatewayのエンドポイントにPOSTメソッドを追加する
    api.root.addMethod("POST");

    // POST /create
    const create = api.root.addResource("create");
    create.addMethod(
      "POST",
      new cdk.aws_apigateway.LambdaIntegration(createPost)
    );

    // GET /list
    const list = api.root.addResource("list");
    list.addMethod("GET", new cdk.aws_apigateway.LambdaIntegration(listPosts)); // GET /list

    // GET /get
    const get = api.root.addResource("get");
    get.addMethod("GET", new cdk.aws_apigateway.LambdaIntegration(getPost)); // 修正：`list`から`get`に変更
  }
}
