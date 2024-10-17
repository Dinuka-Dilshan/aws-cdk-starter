import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolGroup,
  StringAttribute,
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
} from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { USER_POOL_GROUPS } from "../../constants/userpool";

type Props = StackProps & {
  photoBucket: Bucket;
};

export class AuthStack extends Stack {
  public userPool!: UserPool;
  private userPoolClient!: UserPoolClient;
  private identityPool!: CfnIdentityPool;
  private authenticatedRole!: Role;
  private unAuthenticatedRole!: Role;
  private adminRole!: Role;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    this.createUserPool();
    this.createUserPoolClient();
    this.createIdentityPool();
    this.createRoles(props.photoBucket);
    this.attachRoles();
    this.createUserPoolGroup();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, "spaces-user-pool", {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: false,
      },
      customAttributes: { address: new StringAttribute({}) },
    });

    new CfnOutput(this, "space-user-pool-id", {
      value: this.userPool.userPoolId,
      key: "spaceUserPoolId",
    });
  }

  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("spaces-user-pool-client", {
      idTokenValidity: Duration.days(1),
      refreshTokenValidity: Duration.days(2),
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
      roleArn: this.adminRole.roleArn,
    });
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, "Spaces-identity-pool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    new CfnOutput(this, "spacesIdentityPoolId", {
      value: this.identityPool.ref,
      exportName: "spacesIdentityPoolId",
    });
  }

  private createRoles(bucket: Bucket) {
    this.authenticatedRole = new Role(this, "CognitoDefaultAuthenticatedRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    this.unAuthenticatedRole = new Role(
      this,
      "CognitoDefaultUnauthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );

    this.adminRole = new Role(this, "CognitoAdminRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [`${bucket.bucketArn}/*`],
      })
    );

    this.authenticatedRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [`${bucket.bucketArn}/*`],
      })
    );
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this, "RolesAttachment", {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unAuthenticatedRole.roleArn,
      },
      // roleMappings: {
      //   adminsMapping: {
      //     type: "Token",
      //     ambiguousRoleResolution: "AuthenticatedRole",
      //     identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
      //   },
      // },
    });
  }
}
