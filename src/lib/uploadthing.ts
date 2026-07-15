import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const uploadRouter = {
  challengeFile: f({ blob: { maxFileSize: "32MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session || session.user.role !== "admin") {
        throw new UploadThingError("Admin access required");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      return { url: file.url, uploadedBy: metadata.userId };
    }),

  avatar: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session) throw new UploadThingError("Authentication required");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      return { url: file.url, uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
