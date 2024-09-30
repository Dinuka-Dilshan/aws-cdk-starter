import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  const id = v4();
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: `hello from ${process.env.TABLE_NAME} - ${id}`,
    }),
  };
  console.log(`ID-${id}`);
  return result;
};
