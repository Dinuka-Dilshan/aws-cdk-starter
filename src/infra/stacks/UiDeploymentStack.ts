import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { AccessLevel, Distribution } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { existsSync } from "fs";
import { join } from "path";

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const uiDir = join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "space_finder_frontend",
      "dist"
    );

    if (!existsSync(uiDir)) {
      console.warn("UI Directory not found", uiDir);
      return;
    }

    const hostBucket = new Bucket(this, "ui-host-bucket", {
      bucketName: "space-finder-frontend-dinuka",
    });

    new BucketDeployment(this, "ui-deployement-bucket", {
      destinationBucket: hostBucket,
      sources: [Source.asset(uiDir)],
    });

    const s3Origin = S3BucketOrigin.withOriginAccessControl(hostBucket, {
      originAccessLevels: [AccessLevel.READ],
    });

    const distribution = new Distribution(this, "ui-distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: s3Origin,
      },
    });

    new CfnOutput(this, "cloudfrontDistributionDomain", {
      key: "cloudfrontDistributionDomainy",
      value: distribution.distributionDomainName,
    });
  }
}
