import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DataStack extends Stack {
  public readonly table: ITable;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.table = new Table(this, "SpaceTable", {
      partitionKey: {
        name: "_id",
        type: AttributeType.STRING,
      },
      tableName: "SpaceTable",
    });
  }
}
