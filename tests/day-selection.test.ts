import assert from "node:assert/strict";
import { test } from "node:test";
import { getTodayTaskDay } from "../app/[locale]/(dashboard)/(home)/_components/day-selection";

test("maps every weekday to the task schedule, starting with Saturday", () => {
  for (let day = 0; day < 7; day++) {
    const date = new Date(Date.UTC(2026, 9, 3 + day, 12));
    assert.equal(getTodayTaskDay(date), day);
  }
});

test("changes the selected day at midnight in Tehran, independently of server timezone", () => {
  assert.equal(getTodayTaskDay(new Date("2026-10-08T20:29:59Z")), 5);
  assert.equal(getTodayTaskDay(new Date("2026-10-08T20:30:00Z")), 6);
  assert.equal(getTodayTaskDay(new Date("2026-10-09T20:29:59Z")), 6);
  assert.equal(getTodayTaskDay(new Date("2026-10-09T20:30:00Z")), 0);
});
