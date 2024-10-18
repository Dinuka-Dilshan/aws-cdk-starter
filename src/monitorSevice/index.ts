/* global fetch */

import { SNSEvent } from "aws-lambda";

export const handler = async (event: SNSEvent) => {
  console.log(JSON.stringify(event));
  const messages = event.Records.map((r) => r.Sns.Message).join(",");
  await fetch(process.env.SLACK_HOOK as string, {
    method: "POST",
    body: JSON.stringify({ text: messages }),
    headers: {
      "Content-type": "application/json",
    },
  });
};
