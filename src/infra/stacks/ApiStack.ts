import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface Props extends StackProps {
  lambdaIntegration: LambdaIntegration;
  cognitoUserPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const api = new RestApi(this, "SpaceApi");

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "spaces-api-authorizer",
      {
        cognitoUserPools: [props.cognitoUserPool],
        authorizerName: "spaces-api-authorizer",
        identitySource: "method.request.header.Authorization",
      }
    );

    const authOption: MethodOptions = {
      authorizer,
      authorizationType: AuthorizationType.COGNITO,
    };

    const spaces = api.root.addResource("spaces", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        allowCredentials: true,
      },
    });
    spaces.addMethod("GET", props.lambdaIntegration, authOption);
    spaces.addMethod("POST", props.lambdaIntegration, authOption);
    spaces.addMethod("PUT", props.lambdaIntegration, authOption);
    spaces.addMethod("DELETE", props.lambdaIntegration, authOption);

    new CfnOutput(this, "api-endpoint", {
      exportName: "spaceApiEndpoint",
      value: api.url,
    });
  }
}
