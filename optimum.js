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
      val: 30 * 60 * 1000,
      boundary: nowMs - 1800000,
      count: 0,
    },
    "6h": {
      name: "6 hours",
      val: 6 * 60 * 60 * 1000,
      boundary: nowMs - 21600000,
      count: 0,
    },
    "7d": {
      name: "7 days",
      val: 7 * 24 * 60 * 60 * 1000,
      boundary: nowMs - 604800000,
      count: 0,
    },
    "365d": {
      name: "365 days",
      val: 365 * 24 * 60 * 60 * 1000,
      boundary: nowMs - 31536000000,
      count: 0,
    },
  };

  // looping through the event, verifying, and then counting
  for (const ts of events) {
    const ms = Date.parse(ts);
    if (isNaN(ms) || ms > nowMs) continue;

    if (ms >= windows["30m"].boundary) windows["30m"].count++;
    if (ms >= windows["6h"].boundary) windows["6h"].count++;
    if (ms >= windows["7d"].boundary) windows["7d"].count++;
    if (ms >= windows["365d"].boundary) windows["365d"].count++;
  }

  // calculating the minimum chosenWindow
  let chosenWindow = null;
  let minCount = Infinity;

  for (const [key, window] of Object.entries(windows)) {
    if (window.count > 0 && window.count < minCount) {
      minCount = window.count;
      chosenWindow = key;
    }
  }

  // Construct message for returning
  let message;
  if (chosenWindow === null) {
    message = "Not repeated in the last 365 days";
  } else {
    const countTime = minCount === 1 ? "time" : "times";
    message = `Repeated ${minCount} ${countTime} in the last ${windows[chosenWindow].name}`;
  }

  // mapping the respective counts to their window
  const counts = Object.fromEntries(
    Object.entries(windows).map(([key, window]) => [key, window.count])
  );

  return {
    counts,
    chosenWindow,
    chosenCount: chosenWindow ? minCount : 0,
    message,
  };
}


const events = generateTimestamps(5000, { minutes: 30 })
const events2 = generateTimestamps(2000, { hours: 6 })
const events3 = generateTimestamps(5000, { days: 2 })
const events4 = generateTimestamps(10000, { weeks: 1 })
const events5 = generateTimestamps(10000, { months: 2 })
const events6 = generateTimestamps(3000, { weeks: 1, hours: 6 })

console.log(computeRollingCounts(events))
console.log(computeRollingCounts(events2))
console.log(computeRollingCounts(events3))
console.log(computeRollingCounts(events4))
console.log(computeRollingCounts(events5))
console.log(computeRollingCounts(events6))
