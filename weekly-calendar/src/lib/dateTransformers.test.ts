import {describe, expect, it} from "vitest";
import {transformDayToNumber} from "./dateTransformers";
import type {Day} from "../types/days";

describe("dateTransformers", () => {
  it("transformDayToNumber should return correct number for each valid day", () => {
    expect(transformDayToNumber("Vasárnap")).toBe(0);
    expect(transformDayToNumber("Hétfő")).toBe(1);
    expect(transformDayToNumber("Kedd")).toBe(2);
    expect(transformDayToNumber("Szerda")).toBe(3);
    expect(transformDayToNumber("Csütörtök")).toBe(4);
    expect(transformDayToNumber("Péntek")).toBe(5);
    expect(transformDayToNumber("Szombat")).toBe(6);
  });

  it("transformDayToNumber should return -1 for invalid/unknown day", () => {
    expect(transformDayToNumber("InvalidDay" as unknown as Day)).toBe(-1);
  });
});
