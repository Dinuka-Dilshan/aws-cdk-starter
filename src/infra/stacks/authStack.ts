import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AuthStack extends Stack {
  private userPool!: UserPool;
  private userPoolClient!: UserPoolClient;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createUserPool();
    this.createUserPoolClient();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, "spaces-user-pool", {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: false,
      },
    });

    new CfnOutput(this, "space-user-pool-id", {
      value: this.userPool.userPoolId,
      key: "spaceUserPoolId",
    });
  }

  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("spaces-user-pool-client", {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });

    new CfnOutput(this, "space-user-pool-client-id", {
      key: "spaceUserPoolClientId",
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
