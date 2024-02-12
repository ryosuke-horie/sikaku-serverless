import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  // CORS設定
  const headers = {
    "Access-Control-Allow-Origin": "*", // Ideally, this should not be '*', but the domain of your frontend application.
    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // You can add more methods as per your requirement.
    "Access-Control-Allow-Headers": "Content-Type", // You can add more headers as per your requirement.
  };

  try {
    // リクエストからpost_idを取得
    const postId = event.queryStringParameters?.post_id;

    if (!postId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "post_id is required" }),
      };
    }

    // DynamoDBからデータを取得
    const command = new GetCommand({
      TableName: "posts_table", // DynamoDBテーブル名
      Key: { post_id: postId },
    });

    const { Item } = await docClient.send(command);

    if (!Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "Post not found" }),
      };
    }

    // レスポンスを返す
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(Item),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
