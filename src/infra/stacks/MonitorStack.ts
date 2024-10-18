import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Alarm, Metric, Unit } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { join } from "path";

export class MonitorStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api4xxAlarm = new Alarm(this, "SpaceApi4xxAlarm", {
      metric: new Metric({
        metricName: "4XXError",
        namespace: "AWS/ApiGateway",
        period: Duration.minutes(1),
        statistic: "Sum",
        unit: Unit.COUNT,
        dimensionsMap: { ApiName: "SpaceApi" },
      }),
      evaluationPeriods: 1,
      threshold: 5,
      alarmName: "SpaceApi4xxAlarm",
    });

    const snsTopic = new Topic(this, "SpaceApi4xxSNS", {
      displayName: "SpaceApi4xxSNS",
      topicName: "SpaceApi4xxSNS",
    });
    if (!process.env.SLACK_HOOK) {
      throw new Error("No env");
    }
    const monitorLambda = new NodejsFunction(this, "MonitorLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "monitorSevice", "index.ts"),
      environment: {
        SLACK_HOOK: process.env.SLACK_HOOK as string,
      },
      memorySize: 128,
      timeout: Duration.minutes(1),
    });

    api4xxAlarm.addAlarmAction(new SnsAction(snsTopic));
    api4xxAlarm.addOkAction(new SnsAction(snsTopic));

    snsTopic.addSubscription(new LambdaSubscription(monitorLambda));
  }
}
