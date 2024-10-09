import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { USER_POOL_GROUPS } from "../../constants/userpool";

export class AuthStack extends Stack {
  public userPool!: UserPool;
  private userPoolClient!: UserPoolClient;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createUserPool();
    this.createUserPoolClient();
    this.createUserPoolGroup();
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

  private createUserPoolGroup() {
    new CfnUserPoolGroup(this, USER_POOL_GROUPS.ADMIN, {
      userPoolId: this.userPool.userPoolId,
      groupName: USER_POOL_GROUPS.ADMIN,
    });
  }
}
