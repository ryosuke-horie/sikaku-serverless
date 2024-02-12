import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const requestBody = JSON.parse(event.body);

  const qualification =
    requestBody.majorCategory + "#" + requestBody.minorCategory;
  const createdAt = new Date().toISOString(); // ISO 8601形式のタイムスタンプ

  const item = {
    Qualification: qualification, // パーティションキー
    created_at: createdAt, // ソートキー
    Title: requestBody.title,
    MajorCategory: requestBody.majorCategory,
    MinorCategory: requestBody.minorCategory,
    Content: requestBody.content,
    // Auth0: requestBody.auth0user, // 認証情報がある場合はこの行をアンコメント
    // その他の必要な属性...
  };

  // DynamoDBに書き込むためのPutCommandを作成
  const command = new PutCommand({
    TableName: "post-table", // ここで指定したテーブル名に注意
    Item: item,
  });

  try {
    const data = await docClient.send(command);
    console.log("Added item:", JSON.stringify(data, null, 2));

    // Create the response object with CORS headers
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Ideally, this should not be '*', but the domain of your frontend application.
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // You can add more methods as per your requirement.
        "Access-Control-Allow-Headers": "Content-Type", // You can add more headers as per your requirement.
      },
      body: JSON.stringify({ message: "OK" }),
    };
  } catch (err) {
    console.error(
      "Unable to add item. Error JSON:",
      JSON.stringify(err, null, 2)
    );
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        // ... other headers
      },
      body: JSON.stringify(err),
    };
  }
};
