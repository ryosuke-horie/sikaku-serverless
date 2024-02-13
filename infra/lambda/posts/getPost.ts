import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "ap-northeast-1", // 適切なリージョンを指定
});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  console.log(event);

  try {
    const post_id = event.queryStringParameters?.post_id;
    const created_at = event.queryStringParameters?.created_at; // クライアントから正しく送信されていることが前提

    if (!post_id || !created_at) {
      console.log(post_id, created_at);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "post_id and created_at are required",
        }),
      };
    }

    const command = new QueryCommand({
      TableName: "posts-table",
      KeyConditionExpression: "post_id = :post_id AND created_at = :created_at",
      ExpressionAttributeValues: {
        ":post_id": post_id,
        ":created_at": created_at,
      },
    });

    const { Items } = await docClient.send(command);
    if (!Items || Items.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "Post not found" }),
      };
    }

    // 通常、Queryは複数のアイテムを返す可能性があるため、最初のアイテムを返す
    return { statusCode: 200, headers, body: JSON.stringify(Items[0]) };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
