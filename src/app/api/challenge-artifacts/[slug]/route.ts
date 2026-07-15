import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { findChallengeBlueprintBySlug } from "@/lib/challenge-blueprints";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";

function encodedFlag(flag: string) {
  return Buffer.from(flag, "utf8").toString("base64");
}

function artifactBody(slug: string, flag: string) {
  const b64 = encodedFlag(flag);
  const hex = Buffer.from(flag, "utf8").toString("hex");
  const reversed = flag.split("").reverse().join("");

  if (slug.includes("encoding-chain")) {
    return `Layer note
step_1=base64
step_2=hex
step_3=rot13
payload=${Buffer.from(hex, "utf8").toString("base64")}
final_hint=decode the layers in the declared order, then normalize to SPECTRA{...}
`;
  }

  if (slug.includes("rsa-small-e")) {
    return `RSA public material
n=11413
e=3
c=54872
note=training instance: plaintext is intentionally small and unpadded
flag_hint=${b64}
`;
  }

  if (slug.includes("nonce-reuse")) {
    return `stream-cipher capture
ciphertext_a=3f0a151c0b1d1a101b091d
ciphertext_b=2c1b07110e011d06100d0a
known_plaintext_b=launch_at_dawn
recovered_message_base64=${b64}
`;
  }

  if (slug.includes("hash-extension")) {
    return `token service notes
scheme=sha256(secret || "role=user&uid=1042")
goal=append &role=admin without knowing secret
observed_digest=4f2f9e7e129a6b8261aa57c6c0ef4d82468a5dd45e6f1fdbd4ea4252f9f612c1
admin_success_marker=${b64}
`;
  }

  if (slug.includes("packet") || slug.includes("auth-timeline") || slug.includes("memory")) {
    return `forensic evidence bundle
2026-07-15T04:12:08Z GET /login user=guest status=401
2026-07-15T04:13:44Z POST /debug/export host=internal.labs status=200
2026-07-15T04:13:45Z response_chunk=SPECTRA_FRAGMENT:${flag.slice(0, 13)}
2026-07-15T04:13:46Z response_chunk=${flag.slice(13)}
analyst_note=reassemble adjacent fragments and keep braces
`;
  }

  if (slug.includes("exif") || slug.includes("broken-header")) {
    return `pseudo image metadata
FileType=JPEG
Camera=SpectraSec Dispatch Rig
Comment=${b64}
RepairHint=if this were a real binary image, inspect EXIF/comment chunks first
`;
  }

  if (slug.includes("dns") || slug.includes("archive") || slug.includes("alias") || slug.includes("geo") || slug.includes("handle")) {
    return `OSINT case file
seed=spectrasec-research
lead_1=github.com/spectra-archive/old-range/commit/7f3a
lead_2=whois history mentions lab-${slug}.spectrasec.example
lead_3=archived profile bio: ${reversed}
instruction=reverse the archived bio value to recover the final flag
`;
  }

  if (slug.includes("branch") || slug.includes("string") || slug.includes("state") || slug.includes("patch") || slug.includes("opaque")) {
    return `// reverse engineering training artifact
const unsigned char blob[] = { ${Array.from(Buffer.from(flag)).map((byte) => `0x${(byte ^ 0x37).toString(16).padStart(2, "0")}`).join(", ")} };
// validation: for each byte, decoded[i] = blob[i] ^ 0x37
// accepted when decoded starts with "SPECTRA{"
`;
  }

  if (slug.includes("stack") || slug.includes("format") || slug.includes("canary") || slug.includes("rop") || slug.includes("heap")) {
    return `pwn service bundle
host=nc labs.spectrasec.xyz 31337
binary=training-${slug}
protections=NX enabled, PIE partial, canary depends on level
win_marker=${b64}
exploit_note=local simulation artifact; decode marker after solving exploit plan
`;
  }

  if (slug.includes("lsb") || slug.includes("whisper") || slug.includes("spectrogram") || slug.includes("trailer") || slug.includes("polyglot")) {
    return `stego carrier notes
carrier=${slug}
channel=least-significant-bit/comment/trailer depending on challenge
hidden_payload_bits=${Buffer.from(flag).toString("binary")}
hidden_payload_base64=${b64}
`;
  }

  if (slug.includes("qr") || slug.includes("esolang") || slug.includes("race") || slug.includes("constraint") || slug.includes("sanity")) {
    return `misc puzzle artifact
title=${slug}
encoded_flag=${b64}
rule=decode base64 after completing the puzzle mechanic
brainfuck_sample=++++++++[>++++++++<-]>+.
`;
  }

  return `challenge artifact
slug=${slug}
payload=${b64}
`;
}

function contentTypeFor(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "wav":
      return "audio/wav";
    case "pcap":
      return "application/vnd.tcpdump.pcap";
    case "log":
    case "txt":
    case "asm":
    case "py":
    case "c":
    case "bf":
    case "dump":
    case "dmp":
    case "bin":
    case "bytecode":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const blueprint = findChallengeBlueprintBySlug(slug);
  if (!blueprint) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }

  const [challenge] = await db.select({ isPublished: challenges.isPublished }).from(challenges).where(eq(challenges.title, blueprint.title)).limit(1);
  if (!challenge || (!challenge.isPublished && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }
  const resource = blueprint.resources[0];
  const filename = resource?.name ?? `${slug}.txt`;

  return new NextResponse(artifactBody(slug, blueprint.flag), {
    headers: {
      "Content-Type": contentTypeFor(filename),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

