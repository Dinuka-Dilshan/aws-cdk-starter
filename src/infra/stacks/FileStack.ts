import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class FileStack extends Stack {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.bucket = this.createBucket();
  }

  private createBucket() {
    const bucket = new Bucket(this, "spcae-photo-bucket", {
      bucketName: `space-photo-bucket-dinuka`,
      cors: [
        {
          allowedMethods: [HttpMethods.HEAD, HttpMethods.PUT, HttpMethods.GET],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new CfnOutput(this, "photo-bucket", {
      value: bucket.bucketName,
      exportName: "spaces-photo-bucket-name",
    });

    return bucket;
  }
}
