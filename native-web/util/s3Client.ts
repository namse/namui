import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../../env";

if (!env.AWS_ACCESS_KEY || !env.AWS_SECRET_KEY) {
  throw new Error("Wrong aws credentials in env");
}

export const s3Client = new S3Client({
  region: env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});
