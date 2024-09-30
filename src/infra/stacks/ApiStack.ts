import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface Props extends StackProps {
  lambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const api = new RestApi(this, "SpaceApi");
    const spaces = api.root.addResource("spaces");
    spaces.addMethod("GET", props.lambdaIntegration);
  }
}
