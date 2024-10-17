import {
  DynamoDBClient,
  ReturnValue,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { TABLE_NAME } from "../constants/env";
import { ApiError } from "../utils/ApiError";
import { ApiResult } from "../utils/ApiResult";

export default async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
) => {
  if (!event.queryStringParameters?.id || !event.body) {
    throw new ApiError("missing required params");
  }

  const body: { location?: string } = JSON.parse(event.body ?? "");

  if (!body.location) {
    throw new ApiError("missing required params");
  }

  try {
    const result = await ddbClient.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: {
          _id: {
            S: event.queryStringParameters?.id,
          },
        },
        UpdateExpression: "set #X=:x",
        ExpressionAttributeNames: {
          "#X": "Location",
        },
        ExpressionAttributeValues: {
          ":x": {
            S: body.location,
          },
        },
        ReturnValues: ReturnValue.ALL_NEW,
      })
    );

    return new ApiResult().success().json(result);
  } catch (error) {
    return new ApiResult().serverError().json(error);
  }
};
