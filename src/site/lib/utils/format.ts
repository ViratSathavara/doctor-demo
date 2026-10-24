const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

/** "2026-09-12T10:00:00" → "12 Sept 2026". Returns "" for invalid dates. */
export function formatDate(value: string) {
  const date = new Date(/^\d{4}-\d{2}-\d{2}T[\d:.]+$/.test(value) ? `${value}Z` : value);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date).replace(/\bSep\b/, "Sept");
}

/** 11-character YouTube video ID, or null for placeholders like "VIDEO_ID_1". */
export function youtubeId(value: string) {
  const id = value.trim();
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

/** "1000+" → { end: 1000, suffix: "+" }; null for values like "4.9★" that shouldn't count up. */
export function parseCount(value: string) {
  const match = value.trim().match(/^(\d[\d,]*)(\D*)$/);
  return match ? { end: Number(match[1].replace(/,/g, "")), suffix: match[2] } : null;
}
