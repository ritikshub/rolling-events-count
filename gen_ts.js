/**
 * program to generate the timestamps for testing.
 * author: Kaushik
 */
function generateTimestamps(count, range, now = new Date()) {
  const MS = 1000;
  const MIN = 60 * MS;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;

  let maxRangeMs = 0;

  if (range.minutes) maxRangeMs += range.minutes * MIN;
  if (range.hours) maxRangeMs += range.hours * HOUR;
  if (range.days) maxRangeMs += range.days * DAY;
  if (range.weeks) maxRangeMs += range.weeks * WEEK;
  if (range.months) maxRangeMs += range.months * MONTH;

  if (maxRangeMs === 0) {
    throw new Error("Range must specify at least one time unit");
  }

  const nowMs = now.getTime();
  const results = [];

  for (let i = 0; i < count; i++) {
    // Pick a random offset between 0 and maxRangeMs
    const offset = Math.floor(Math.random() * maxRangeMs);

    // Subtract from now to get a past timestamp
    const t = new Date(nowMs - offset);

    results.push(t.toISOString());
  }

  return results;
}

const events = generateTimestamps(50, { minutes: 30 });
const events2 = generateTimestamps(200, { hours: 6 });
const event3 = generateTimestamps(500, { days: 2 });
const event4 = generateTimestamps(1000, { weeks: 1 });
const event5 = generateTimestamps(1000, { months: 2 });
const event6 = generateTimestamps(300, { weeks: 1, hours: 6 });

module.exports = {
  generateTimestamps,
};
