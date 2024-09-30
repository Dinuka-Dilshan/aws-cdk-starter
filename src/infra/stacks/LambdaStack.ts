import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";

interface Props extends StackProps {
  table: ITable;
}

export class LambdaStack extends Stack {
  public readonly lambdaIntegration: LambdaIntegration;
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const lambda = new LambdaFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: Code.fromAsset(join(__dirname, "..", "..", "services")),
      functionName: "HelloLambdaCDK",
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });
    this.lambdaIntegration = new LambdaIntegration(lambda);
  }
}
