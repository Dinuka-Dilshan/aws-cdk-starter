import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ApiResult } from "../utils/ApiResult";
import deleteHandler from "./deleteHandler";
import { getHandler } from "./getHandler";
import { postHandler } from "./postHandler";
import putHandler from "./putHandler";

const ddbClient = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  try {
    if (event.httpMethod === "GET") {
      const result = await getHandler(event, ddbClient);
      return result;
    }

    if (event.httpMethod === "POST") {
      const result = await postHandler(event, ddbClient);
      return result;
    }

    if (event.httpMethod === "PUT") {
      const result = await putHandler(event, ddbClient);
      return result;
    }

    if (event.httpMethod === "DELETE") {
      const result = await deleteHandler(event, ddbClient);
      return result;
    }
  } catch (error) {
    return new ApiResult().serverError().json({ error });
  }
};
