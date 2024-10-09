import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { randomUUID } from "crypto";
import { TABLE_NAME } from "../constants/env";
import { ApiError } from "../utils/ApiError";
import { ApiResult } from "../utils/ApiResult";

export const postHandler = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
) => {
  const body = JSON.parse(event.body ?? "");

  if (!body?.location) {
    throw new ApiError("location cannot be empty");
  }

  try {
    await ddbClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall({ _id: randomUUID(), Location: body.location }),
      })
    );

    return new ApiResult().success().json({ message: "Saved Successfully" });
  } catch (error) {
    return new ApiResult().serverError().json({});
  }
};
