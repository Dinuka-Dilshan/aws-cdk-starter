import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 } from "uuid";
import { TABLE_NAME } from "../constants/env";
import { ApiResult } from "../utils/ApiResult";

export const postHandler = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
) => {
  const body = JSON.parse(event.body ?? "");

  if (!body?.location) {
    return new ApiResult().badRequest("location cannot be empty").json({});
  }

  try {
    await ddbClient.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall({ _id: v4(), Location: body.location }),
      })
    );

    return new ApiResult().success().json({ message: "Saved Successfully" });
  } catch (error) {
    return new ApiResult().serverError().json({});
  }
};
