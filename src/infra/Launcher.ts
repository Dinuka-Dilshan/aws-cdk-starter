import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/ApiStack";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambda = new LambdaStack(app, "LambdaStack", { table: dataStack.table });
new ApiStack(app, "ApiStack", { lambdaIntegration: lambda.lambdaIntegration });
