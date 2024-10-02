import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";
import { SpaceItem } from "../../types";
import { parseDbItemList } from "../utils/parseDbReult";

const ddbClient = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  const location = event.queryStringParameters?.location ?? "";
  const item: SpaceItem = { _id: v4(), location };

  const dbResult = await ddbClient.send(
    new ScanCommand({ TableName: process.env.TABLE_NAME })
  );
  console.log("-------", dbResult);
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(parseDbItemList(dbResult.Items)),
  };
  return result;
};
