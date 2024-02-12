import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async () => {
  const params = {
    TableName: "post-table",
  };

  try {
    const command = new ScanCommand(params);
    const data = await docClient.send(command);

    // スキャン結果をソートキー（例: created_at）で逆順にソート
    const sortedItems = data.Items.sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    );

    return {
      statusCode: 200,
      body: JSON.stringify(sortedItems),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // CORS設定
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to scan the items" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
