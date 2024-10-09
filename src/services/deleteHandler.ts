import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { TABLE_NAME } from "../constants/env";
import { ApiError } from "../utils/ApiError";
import { ApiResult } from "../utils/ApiResult";

export default async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
) => {
  if (!event.queryStringParameters?.id) {
    throw new ApiError("missing required params");
  }

  try {
    await ddbClient.send(
      new DeleteItemCommand({
        Key: { _id: { S: event.queryStringParameters?.id } },
        TableName: TABLE_NAME,
      })
    );
    return new ApiResult().success().json({ message: "Deleted!!" });
  } catch (error) {
    return new ApiResult().serverError().json({ message: error });
  }
};
