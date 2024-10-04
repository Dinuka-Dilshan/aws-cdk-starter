import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { TABLE_NAME } from "../constants/env";
import { ApiResult } from "../utils/ApiResult";

const getItem = async (ddbClient: DynamoDBClient, id?: string) => {
  if (!id) return;

  try {
    const resultItem = await ddbClient.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: {
          _id: {
            S: id,
          },
        },
      })
    );

    if (!resultItem.Item) {
      return new ApiResult().notFound("Item not found").json([]);
    }

    return new ApiResult().success().json(unmarshall(resultItem.Item));
  } catch (error) {
    return new ApiResult().serverError().json(error);
  }
};

const getItems = async (ddbClient: DynamoDBClient) => {
  try {
    const resultItems = await ddbClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    if (!resultItems.Items) {
      return new ApiResult().notFound("No items found").json([]);
    }

    return new ApiResult()
      .success()
      .json(resultItems?.Items?.map((i) => unmarshall(i)));
  } catch (error) {
    return new ApiResult().serverError().json(error);
  }
};

export const getHandler = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
) => {
  const result = await getItem(ddbClient, event?.queryStringParameters?.id);

  if (result) {
    return result;
  }

  const results = await getItems(ddbClient);

  return results;
};
