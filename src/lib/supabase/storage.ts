import { createSupabaseAdminClient } from "./admin";

export const UPLOADS_BUCKET = "uploads";

function publicUrlFor(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${base}/storage/v1/object/public/${UPLOADS_BUCKET}/${path}`;
}

export async function ensureUploadsBucket() {
  const admin = createSupabaseAdminClient();
  const { data } = await admin.storage.listBuckets();
  if (!data?.some((bucket) => bucket.name === UPLOADS_BUCKET)) {
    await admin.storage.createBucket(UPLOADS_BUCKET, {
      public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    });
  }
}

export async function uploadToStorage(input: {
  userId: string;
  filename: string;
  body: Buffer | ArrayBuffer | Blob;
  contentType: string;
}) {
  await ensureUploadsBucket();
  const admin = createSupabaseAdminClient();
  const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${input.userId}/${Date.now()}-${safeName}`;
  const { error } = await admin.storage.from(UPLOADS_BUCKET).upload(path, input.body, {
    contentType: input.contentType,
    upsert: false,
  });
  if (error) throw error;
  const { data } = admin.storage.from(UPLOADS_BUCKET).getPublicUrl(path);
  return data.publicUrl || publicUrlFor(path);
}
