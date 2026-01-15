/**
 * program to compute the rolling events count in a time window
 * author: Ritik
 */

const { generateTimestamps } = require("./gen_ts")
function computeRollingCounts(events, now = new Date()) {
  if (!now) {
    now = new Date(now)
  }
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

  // count events in each window: t >= (now - windowSize) && t <= now
  const counts = {}
  let chosenWindow = null
  let minCountForChosenWindow = 0

  // find smallest window with events > 0 
  for (const [windowKey, window] of Object.entries(windows)) {
    const windowStart = now.getTime() - window.val

    // count and stores it in key value pair.
    counts[windowKey] = validPastTimestamps.filter(
      (ts) => ts >= windowStart
    ).length

    // Track smallest window with count > 0
    if (
      (counts[windowKey] > 0 && chosenWindow === null) || // this checks if this is the first window with a positive count
      counts[windowKey] < minCountForChosenWindow // this check if the current has fewer events that the one we already have.
    ) {
      chosenWindow = windowKey // if yes, update the chosenWindow to new minimum.
      minCountForChosenWindow = counts[windowKey]
    }
  }
  // constructing message part as per values
  let message;
  if (chosenWindow === null) {
    // means no events in last 365 days
    message = "Not repeated in the last 365 days"
  } else {
    const countTime = minCountForChosenWindow === 1 ? "time" : "times"; // if count is 1 then time, greater than 1 will show times
    message = `Repeated ${minCountForChosenWindow} ${countTime} in the last ${windows[chosenWindow].name}`
  }

  return {
    counts,
    chosenWindow,
    chosenCount: minCountForChosenWindow,
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
