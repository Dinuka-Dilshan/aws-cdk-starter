import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/ApiStack";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { AuthStack } from "./stacks/authStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambda = new LambdaStack(app, "LambdaStack", { table: dataStack.table });
const authStack = new AuthStack(app, "AuthStack");
new ApiStack(app, "ApiStack", {
  lambdaIntegration: lambda.lambdaIntegration,
  cognitoUserPool: authStack.userPool,
});
