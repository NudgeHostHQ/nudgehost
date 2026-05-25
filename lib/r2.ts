import { S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 is S3-compatible, so we drive it with the AWS S3 SDK.
// region is always "auto" for R2; the real routing comes from the endpoint.
const requiredEnv = [
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`${key} is not set`);
  }
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME as string;
