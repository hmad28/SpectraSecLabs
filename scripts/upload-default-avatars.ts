import { config } from "dotenv";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { UTApi, UTFile } from "uploadthing/server";

config({ path: ".env.local" });

async function main() {
  const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
  const files = [];
  for (let index = 1; index <= 15; index += 1) {
    const name = `spectrasec-default-avatar-${String(index).padStart(2, "0")}.svg`;
    const sourceName = `avatar-${String(index).padStart(2, "0")}.svg`;
    const buffer = await readFile(join(process.cwd(), "public", "images", "avatars", sourceName));
    files.push(new UTFile([buffer], name, { type: "image/svg+xml", customId: name }));
  }

  const results = await utapi.uploadFiles(files, { acl: "public-read" });
  const urls = results.map((result, index) => {
    if (result.error) throw new Error(`Upload failed for avatar ${index + 1}: ${result.error.message}`);
    return result.data.ufsUrl || result.data.url;
  });
  await writeFile(join(process.cwd(), "public", "images", "avatars", "uploadthing-urls.json"), `${JSON.stringify(urls, null, 2)}\n`);
  console.log(JSON.stringify(urls, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
