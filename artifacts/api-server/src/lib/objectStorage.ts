import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

function createR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  if (!accountId) throw new Error("R2_ACCOUNT_ID env var is required");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    },
    requestChecksumRequired: false,
  });
}

function getBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME env var is required");
  return bucket;
}

function getPublicUrl(): string {
  const url = process.env.R2_PUBLIC_URL;
  if (!url) throw new Error("R2_PUBLIC_URL env var is required");
  return url.replace(/\/$/, "");
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  async getUploadUrl(contentType?: string): Promise<{ uploadURL: string; publicURL: string }> {
    const client = createR2Client();
    const bucket = getBucketName();
    const publicBaseUrl = getPublicUrl();

    const key = `uploads/${randomUUID()}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ...(contentType ? { ContentType: contentType } : {}),
    });

    const uploadURL = await getSignedUrl(client, command, { expiresIn: 900 });
    const publicURL = `${publicBaseUrl}/${key}`;

    return { uploadURL, publicURL };
  }
}
