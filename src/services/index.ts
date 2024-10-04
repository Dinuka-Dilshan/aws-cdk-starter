import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ApiResult } from "../utils/ApiResult";
import { getHandler } from "./getHandler";
import { postHandler } from "./postHandler";

const ddbClient = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  if (event.httpMethod === "GET") {
    const result = await getHandler(event, ddbClient);
    return result;
  }

  if (event.httpMethod === "POST") {
    const result = await postHandler(event, ddbClient);
    return result;
  }

  return new ApiResult().serverError().json({ message: "wrong endpoint" });
};
