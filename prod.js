/**
 * program to compute the rolling events count in a time window
 * author: Ritik
 */

const { generateTimestamps } = require("./gen_ts")

function computeRollingCounts(events, now = new Date()) {

  const validPastTimestamps = events
    .map((ts) => {
      const ms = Date.parse(ts) // convert to unix milliseconds.
      return ms <= now.getTime() && !isNaN(ms) ? ms : null // ignore future/invalid
    })
    .filter(Boolean) // Remove false, 0, empty, null, undefined values from an array.

  const windows = {
    "30m": { name: "30 minutes", val: 30 * 60 * 1000 },
    "6h": { name: "6 hours", val: 6 * 60 * 60 * 1000 },
    "7d": { name: "7 days", val: 7 * 24 * 60 * 60 * 1000 },
    "365d": { name: "365 days", val: 365 * 24 * 60 * 60 * 1000 },
  };

  const nowMs = now.getTime();
  
  // pre-computed values of now - window for o(1) look up 
  const windowBoundaries = {};
  for (const [key, window] of Object.entries(windows)) {
    windowBoundaries[key] = nowMs - window.val;
  }

  // single iteration that will check the window and update the count
  const counts = { "30m": 0, "6h": 0, "7d": 0, "365d": 0 };
  for (const ts of validPastTimestamps) {
    
    if (ts >= windowBoundaries["30m"]) counts["30m"]++;
    if (ts >= windowBoundaries["6h"]) counts["6h"]++;  
    if (ts >= windowBoundaries["7d"]) counts["7d"]++;
    if (ts >= windowBoundaries["365d"]) counts["365d"]++;
  }
  let chosenWindow = null;
  let minCountForChosenWindow = 0;

  // finding the chosenWindow 
  for (const [windowKey, window] of Object.entries(windows)) {
    if (
      (counts[windowKey] > 0 && chosenWindow === null) || // this checks if this is the first window with a positive count
      counts[windowKey] < minCountForChosenWindow        // this check if the current has fewer events that the one we already have. 
    ) {
      chosenWindow = windowKey;    // if yes, update the chosenWindow with the new minimum
      minCountForChosenWindow = counts[windowKey]; // updates its count also
    }
  }

  // constructing message part as per values
  let message;
  if (chosenWindow === null) {
    message = "Not repeated in the last 365 days";
  } else {
    const countTime = minCountForChosenWindow === 1 ? "time" : "times";
    message = `Repeated ${minCountForChosenWindow} ${countTime} in the last ${windows[chosenWindow].name}`;
  }

  return {
    counts,
    chosenWindow,
    chosenCount: minCountForChosenWindow,
    message,
  };
}

const events = generateTimestamps(30000, { weeks: 1, hours: 6 })

console.log(computeRollingCounts(events))