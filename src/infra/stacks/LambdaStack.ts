import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
//import { LlrtFunction } from "cdk-lambda-llrt";
import { Construct } from "constructs";
import { join } from "path";

interface Props extends StackProps {
  table: ITable;
}

export class LambdaStack extends Stack {
  public readonly lambdaIntegration: LambdaIntegration;
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const lambda = new NodejsFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "services", "index.ts"),
      functionName: "HelloLambdaCDK",
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });
    this.lambdaIntegration = new LambdaIntegration(lambda);
  }
}
