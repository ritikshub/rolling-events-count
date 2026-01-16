/**
 * program to compute the rolling events count in a time window
 * author: Ritik
 */

const { generateTimestamps } = require("./gen_ts");

function computeRollingCounts(events, now = new Date()) {
  const nowMs = now.getTime();
  const windows = {
    "30m": {
      name: "30 minutes",
      boundary: nowMs - 30 * 60 * 1000, // val: 30 * 60 * 1000,
      count: 0,
    },
    "6h": {
      name: "6 hours",
      boundary: nowMs - 6 * 60 * 60 * 1000,
      count: 0,
    },
    "7d": {
      name: "7 days",
      boundary: nowMs - 7 * 24 * 60 * 60 * 1000,
      count: 0,
    },
    "365d": {
      name: "365 days",
      boundary: nowMs - 365 * 24 * 60 * 60 * 1000,
      count: 0,
    },
  };

  for (const ts of events) {
    const ms = Date.parse(ts);
    if (isNaN(ms) || ms > nowMs) continue; // only sending the valid timestamp ahead

    Object.entries(windows).forEach(([key, value]) => {
      // counting for all the window in windows
      if (ms >= value.boundary) value.count++; // means for 30m, 6hr, 7days, 365 days
    });
  }

  // calculating the chosenWindow i.e, timeWindow with the lowest count.
  let chosenWindow = null;
  Object.entries(windows).forEach(([key, value]) => {
    if (value.count != null && value.count > 0) {
      if (chosenWindow === null || value.count < windows[chosenWindow].count) {
        chosenWindow = key;
      }
    }
  });

  // Construct message for returning
  let message;
  if (chosenWindow === null) {
    message = "Repeated for the first time";
  } else {
    const minCount = windows[chosenWindow].count; //getting count for the chosen window
    const countTime = minCount === 1 ? "time" : "times";
    message = `Repeated ${minCount} ${countTime} in the last ${windows[chosenWindow].name}`;
  }

  // converts array back to object: like: counts: { '30m': 7, '6h': 103, '7d': 2908, '365d': 3000 }
  const counts = Object.fromEntries(
    Object.entries(windows).map(([key, value]) => [key, value.count]) // extract count from windows and covert to key, value pair
  );

  return {
    counts,
    chosenWindow,
    chosenCount: chosenWindow ? windows[chosenWindow].count : 0,
    message,
  };
}

const event = [];
const events = generateTimestamps(5000, { minutes: 30 });
const events2 = generateTimestamps(2000, { hours: 6 });
const events3 = generateTimestamps(5000, { days: 2 });
const events4 = generateTimestamps(10000, { weeks: 1 });
const events5 = generateTimestamps(10000, { months: 2 });
const events6 = generateTimestamps(3000, { weeks: 1, hours: 6 });

console.log(computeRollingCounts(event));
console.log(computeRollingCounts(events));
console.log(computeRollingCounts(events2));
console.log(computeRollingCounts(events3));
console.log(computeRollingCounts(events4));
console.log(computeRollingCounts(events5));
console.log(computeRollingCounts(events6));
