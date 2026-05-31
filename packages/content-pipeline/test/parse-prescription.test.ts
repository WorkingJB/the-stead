import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePrescription } from "../src/parse-prescription.ts";

test("rep range", () => {
  const p = parsePrescription("Standard pushup: 3 × 8-12", 1);
  assert.equal(p.kind, "exercise");
  assert.equal(p.movementName, "Standard pushup");
  assert.equal(p.sets, 3);
  assert.equal(p.repLow, 8);
  assert.equal(p.repHigh, 12);
  assert.equal(p.perSide, undefined);
});

test("single rep count fills both bounds", () => {
  const p = parsePrescription("Barbell back squat: 3 × 8", 0);
  assert.equal(p.sets, 3);
  assert.equal(p.repLow, 8);
  assert.equal(p.repHigh, 8);
});

test("duration in seconds", () => {
  const p = parsePrescription("Plank: 3 × 45 sec", 0);
  assert.equal(p.durationSec, 45);
  assert.equal(p.repLow, undefined);
});

test("compact seconds and per-side", () => {
  const p = parsePrescription("Side plank: 3 × 30s each side", 0);
  assert.equal(p.durationSec, 30);
  assert.equal(p.perSide, true);
});

test("ea side reps", () => {
  const p = parsePrescription("Bird dog: 4 × 12 ea side", 0);
  assert.equal(p.repLow, 12);
  assert.equal(p.repHigh, 12);
  assert.equal(p.perSide, true);
});

test("rep range per side keeps the range", () => {
  const p = parsePrescription("KB strict press, single arm: 3 × 6-8 each side", 0);
  assert.equal(p.movementName, "KB strict press, single arm");
  assert.equal(p.repLow, 6);
  assert.equal(p.repHigh, 8);
  assert.equal(p.perSide, true);
});

test("distance in meters", () => {
  const p = parsePrescription("Farmer's carry: 3 × 30 m", 0);
  assert.equal(p.distanceM, 30);
  assert.equal(p.durationSec, undefined);
});

test("trailing parenthetical becomes a note", () => {
  const p = parsePrescription("Power clean: 4 × 3 (light, technical)", 0);
  assert.equal(p.sets, 4);
  assert.equal(p.repLow, 3);
  assert.equal(p.note, "light, technical");
});

test("load hint from name parenthetical", () => {
  const p = parsePrescription("Goblet squat (10 lb): 4 × 5", 0);
  assert.equal(p.loadHint, "10 lb");
  assert.equal(p.repLow, 5);
});

test("minutes convert to seconds", () => {
  const p = parsePrescription("Row: 3 × 2 min", 0);
  assert.equal(p.durationSec, 120);
});

test("warmup line with no sets is a note", () => {
  const p = parsePrescription("Warmup: 5 min easy movement, joint circles", 0);
  assert.equal(p.kind, "note");
  assert.equal(p.movementName, undefined);
  assert.equal(p.rawText, "Warmup: 5 min easy movement, joint circles");
});

test("colon-less cardio line is a note", () => {
  const p = parsePrescription("45 min continuous walking, conversational pace", 7);
  assert.equal(p.kind, "note");
  assert.equal(p.orderIdx, 7);
});

test("interval line with × but no leading movement is a note", () => {
  const p = parsePrescription(
    "5 min easy warmup, then 2 × 6 min of brisk uphill walking",
    0,
  );
  assert.equal(p.kind, "note");
});

test("trailing colon header is a note", () => {
  const p = parsePrescription("25 min walk with intervals:", 0);
  assert.equal(p.kind, "note");
});

test("equipment parenthetical in name does not break the split", () => {
  const p = parsePrescription(
    "Inverted row (under table or broomstick on chairs): 3 × 8",
    0,
  );
  assert.equal(p.movementName, "Inverted row (under table or broomstick on chairs)");
  assert.equal(p.repLow, 8);
  assert.equal(p.loadHint, undefined);
});
