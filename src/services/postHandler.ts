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

  if (!body?.location || !body?.imageUrl) {
    throw new ApiError("location and image url cannot be empty");
  }

  const _id = randomUUID();

  try {
    await ddbClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall({
          _id,
          Location: body.location,
          ImageUrl: body.imageUrl,
        }),
      })
    );

    return new ApiResult()
      .success()
      .json({ message: "Saved Successfully", _id });
  } catch (error) {
    return new ApiResult().serverError().json({});
  }
};
