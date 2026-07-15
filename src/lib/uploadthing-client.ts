"use client";

import { generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "./uploadthing";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
