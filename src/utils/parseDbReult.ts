import { AttributeValue } from "@aws-sdk/client-dynamodb";

export const parseDbItemList = (items?: Record<string, AttributeValue>[]) =>
  items?.map((item) => ({ _id: item._id.S, location: item.Loation.S }));
