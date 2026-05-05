import {describe, expect, it} from "vitest";
import {DAYS, HOURS} from "./calendarConstants";

describe("DAYS", () => {
  it("should have correct number of days", () => {
    expect(DAYS.length).toEqual(7);
  });

  it("should contain correct days of the week", () => {
    expect(DAYS).toEqual([
      "Hétfő",
      "Kedd",
      "Szerda",
      "Csütörtök",
      "Péntek",
      "Szombat",
      "Vasárnap",
    ]);
  });
});

describe("HOURS", () => {
  it("should have correct number of hours", () => {
    expect(HOURS.length).toEqual(13);
  });

  it("should contain correct hours", () => {
    expect(HOURS).toEqual([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });
});
