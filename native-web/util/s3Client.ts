import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY) {
  throw new Error("Wrong aws credentials in process.env");
}

export const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
