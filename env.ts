if (!process.env.S3_BUCKET_REGION) {
  throw new Error("no process.env.S3_BUCKET_REGION");
}
if (!process.env.S3_BUCKET_NAME) {
  throw new Error("no process.env.S3_BUCKET_NAME");
}
if (!process.env.AWS_ACCESS_KEY) {
  throw new Error("no process.env.AWS_ACCESS_KEY");
}
if (!process.env.AWS_SECRET_KEY) {
  throw new Error("no process.env.AWS_SECRET_KEY");
}

export const env = {
  S3_BUCKET_REGION: process.env.S3_BUCKET_REGION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
};
