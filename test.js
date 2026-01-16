const now = new Date();
const nowMs = now.getTime();
console.log(nowMs)
const windows = {
    "30m": { name: "30 minutes", val: 30 * 60 * 1000, boundary: nowMs - 1800000},
    "6h": { name: "6 hours", val: 6 * 60 * 60 * 1000, boundary: nowMs - 21600000},
    "7d": { name: "7 days", val: 7 * 24 * 60 * 60 * 1000, boundary: nowMs - 604800000},
    "365d": { name: "365 days", val: 365 * 24 * 60 * 60 * 1000, boundary: nowMs - 31536000000},
};
console.log(windows["365d"].boundary)






