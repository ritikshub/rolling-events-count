/**
 * program to compute the rolling events count in a time window
 * author: Ritik
 */

const { generateTimestamps } = require("./gen_ts");
function computeRollingCounts(events, now = new Date()) {
  if (!now) {
    now = new Date(now);
  }
  const validPastTimestamps = events
    .map((ts) => {
      const ms = Date.parse(ts); // convert to unix milliseconds.
      return ms <= now.getTime() && !isNaN(ms) ? ms : null; // ignore future/invalid
    })
    .filter(Boolean); // Remove false, 0, empty, null, undefined values from an array.

  const windowSizes = {
    "30m": 30 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "365d": 365 * 24 * 60 * 60 * 1000,
  };

  // Count events in each window: t >= (now - windowSize) && t <= now
  const counts = {};
  let chosenWindow = null;
  let minCountForChosenWindow = 0;

  // Find smallest window with events > 0 (check in order: 30m → 365d)
  for (const [windowKey, windowSize] of Object.entries(windowSizes)) {
    const windowStart = now.getTime() - windowSize;

    // count and stores it in key value pair.
    counts[windowKey] = validPastTimestamps.filter(
      (ts) => ts >= windowStart
    ).length;

    // Track smallest window with count > 0
    if (
      (counts[windowKey] > 0 && chosenWindow === null) ||
      counts[windowKey] < minCountForChosenWindow
    ) {
      // chosenWindow === null for first positive case
      chosenWindow = windowKey;
      minCountForChosenWindow = counts[windowKey];
    }
  }

  // Window display names for message formatting
  const windowNames = {
    "30m": "30 minutes",
    "6h": "6 hours",
    "7d": "7 days",
    "365d": "365 days",
  };

  // constructing message part as per values
  let message;
  if (chosenWindow === null) {
    // means no events in last 365 days
    message = "Not repeated in the last 365 days";
  } else {
    const countTime = minCountForChosenWindow === 1 ? "time" : "times"; //if count is 1 then time, greater than 1 will show times
    message = `Repeated ${minCountForChosenWindow} ${countTime} in the last ${windowNames[chosenWindow]}`;
  }

  return {
    counts,
    chosenWindow,
    chosenCount: minCountForChosenWindow,
    message,
  };
}

const events = generateTimestamps(300, { weeks: 1, hours: 6 });
console.log(computeRollingCounts(events));
