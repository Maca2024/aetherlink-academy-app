# Connect object storage

Academy stores uploaded files in an S3-compatible bucket and keeps only their metadata in Postgres. This guide sets up Cloudflare R2 for production and MinIO for local work.

Without credentials the feature stays off. Every `/game/files` route answers 503 and the rest of the app is unaffected.

## Create the R2 bucket

Create the bucket in the EU jurisdiction, so objects stay in the EU:

```bash
npx wrangler r2 bucket create aetherlink-academy --jurisdiction eu
```

The jurisdiction decides the endpoint host, and it is fixed at creation. An EU bucket is reachable only at `https://<account-id>.eu.r2.cloudflarestorage.com`. A bucket created without a jurisdiction uses the plain `https://<account-id>.r2.cloudflarestorage.com`. Both hosts answer the same authorization error to an unsigned request, so probing them tells you nothing. Check an existing bucket instead:

```bash
npx wrangler r2 bucket info aetherlink-academy
```

To change the jurisdiction of a bucket that already exists, create a new one and copy the objects across. There is no in-place move.

## Create a scoped API token

1. Open the Cloudflare dashboard, then **R2 object storage** → **API** → **Manage API tokens**.
2. Create a token with **Object Read & Write**.
3. Scope it to `aetherlink-academy` alone. Do not use an account-wide admin token.
4. Copy the **Access Key ID** and the **Secret Access Key**. Cloudflare shows the secret once.

## Configure the server

Add these to `/root/aetherlink-academy/.env` on the VPS, mode 600. Never commit them.

| Variable | Value |
| --- | --- |
| `S3_BUCKET` | `aetherlink-academy` |
| `S3_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com`, or the `.eu.` host for an EU bucket |
| `S3_ACCESS_KEY_ID` | the token's access key id |
| `S3_SECRET_ACCESS_KEY` | the token's secret access key |
| `S3_REGION` | leave unset; it defaults to `auto`, which is what R2 expects |

The `R2_*` spellings work too. Both names match the upstream agent-native app, so a future standalone deployment reads the same environment.

Restart the container. `GET /game/files` answers 200 with an empty list once the credentials load.

## Run against MinIO locally

```bash
docker run -d --name academy-dev-minio -p 127.0.0.1:59000:9000 \
  -e MINIO_ROOT_USER=academy -e MINIO_ROOT_PASSWORD=academy-dev-secret \
  quay.io/minio/minio:latest server /data
```

Create the bucket once, then export the same four variables with `S3_ENDPOINT=http://127.0.0.1:59000`. The S3 layer signs path-style requests, which is the one dialect both R2 and MinIO accept unchanged, so no code path differs between them.

Run the gated round-trip test with those variables set:

```bash
node --test tests/storage-s3.test.ts
```

## Why the bucket stays private

Academy serves every byte through `GET /game/files/:fileId`, which checks the squad session first. The bucket needs no public access.

Serving straight from a CDN would need a custom domain on the bucket, and a custom domain must be a zone in the same Cloudflare account. Keeping DNS at GoDaddy requires a partial CNAME setup, which is a Business plan feature. Delegating only `cdn.aetherlink.ai` requires a subdomain zone, which is Enterprise. The remaining option moves the `aetherlink.ai` nameservers to Cloudflare, and that apex currently serves the marketing site from a separate Vercel account. Until that moves, private plus proxy is both cheaper and a better match for client material.

## Limits

- Maximum upload is 25 MiB. There is no multipart upload, so the whole body is buffered in memory. Video does not belong here.
- Allowed types are PNG, JPEG, GIF, WebP, SVG, PDF, plain text, Markdown, CSV and JSON. The object key's extension comes from the content type, never from the filename.
- SVG downloads as an attachment rather than rendering inline, because a same-origin SVG can execute script. Other images render inline.
- Files belong to one squad room. A file from another room answers 404, not 403, so it does not leak existence.
- Deleting a deck's room cascades to its file rows. Objects in the bucket are removed on a best-effort basis, so set a lifecycle rule if orphans matter.
