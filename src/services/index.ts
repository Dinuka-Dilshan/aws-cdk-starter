import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const client = new S3Client({});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  const command = new ListBucketsCommand();
  const bucketList = await client.send(command);
  const list = bucketList.Buckets?.map(
    (b) => `${b.Name} - created at - ${b.CreationDate}`
  );
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      list
    }),
  };
  return result;
};
