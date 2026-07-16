import assert from "node:assert/strict";
import test from "node:test";
import { parseChallengeInput, safeRedirectPath } from "./validation";

test("safeRedirectPath rejects external and protocol-relative redirects", () => {
  assert.equal(safeRedirectPath("https://evil.example"), "/labs");
  assert.equal(safeRedirectPath("//evil.example"), "/labs");
  assert.equal(safeRedirectPath("/dashboard?tab=solves"), "/dashboard?tab=solves");
});

test("parseChallengeInput validates enums and point boundaries", () => {
  assert.throws(() => parseChallengeInput({ category: "invalid" }, true));
  const parsed = parseChallengeInput({
    title: "Intro Web",
    description: "A legal web security challenge.",
    category: "web",
    difficulty: "easy",
    points: 100,
    flag: "SPECTRA{test}",
    files: [],
  }, true);
  assert.equal(parsed.points, 50);
  assert.equal(parsed.category, "web");
});

