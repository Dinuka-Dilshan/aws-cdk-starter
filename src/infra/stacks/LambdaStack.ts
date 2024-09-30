import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";

export class LambdaStack extends Stack {
  public readonly lambdaIntegration: LambdaIntegration;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const lambda = new LambdaFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: Code.fromAsset(join(__dirname, "..", "..", "services")),
      functionName: "HelloLambdaCDK",
    });
    this.lambdaIntegration = new LambdaIntegration(lambda);
  }
}
