import 'dotenv/config'

import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/authStack";
import { DataStack } from "./stacks/DataStack";
import { FileStack } from "./stacks/FileStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { MonitorStack } from "./stacks/MonitorStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambda = new LambdaStack(app, "LambdaStack", { table: dataStack.table });
const photoStack = new FileStack(app, "PhotoStack");
const authStack = new AuthStack(app, "AuthStack", {
  photoBucket: photoStack.bucket,
});
new ApiStack(app, "ApiStack", {
  lambdaIntegration: lambda.lambdaIntegration,
  cognitoUserPool: authStack.userPool,
});
new UiDeploymentStack(app, "UiDdeployementStack");
new MonitorStack(app, "MonitorStack");
