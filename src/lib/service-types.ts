export type OrderExtras = {
  comments?: string;
  usernames?: string;
  keywords?: string;
  hashtag?: string;
  username?: string;
  groups?: string;
  answer_number?: string;
  runs?: number;
  interval?: number;
  min?: number;
  max?: number;
  posts?: number;
  old_posts?: number;
  delay?: number;
  expiry?: string;
};

export type ServiceField =
  | "link"
  | "quantity"
  | "comments"
  | "usernames"
  | "keywords"
  | "hashtag"
  | "username"
  | "groups"
  | "answer_number"
  | "drip"
  | "subscription";

function typeName(type?: string) {
  return (type || "Default").toLowerCase();
}

export function isPackageType(type?: string) {
  const value = typeName(type);
  return value === "package" || (value.includes("package") && !value.includes("comment"));
}

export function isSubscriptionType(type?: string) {
  return typeName(type).includes("subscription");
}

export function fieldsForService(type?: string, dripfeed = false): ServiceField[] {
  const value = typeName(type);

  if (isSubscriptionType(value)) return ["username", "subscription"];
  if (isPackageType(value)) return ["link"];

  const fields: ServiceField[] = ["link"];

  if (value.includes("custom comment")) {
    fields.push("comments");
    if (!value.includes("package")) fields.push("quantity");
    return fields;
  }
  if (value.includes("custom list") || value.includes("mentions custom")) {
    fields.push("usernames");
    return fields;
  }
  if (value.includes("hashtag")) {
    fields.push("quantity", "hashtag");
    return fields;
  }
  if (value.includes("seo") || value.includes("keyword")) {
    fields.push("quantity", "keywords");
    return fields;
  }
  if (value.includes("comment like")) {
    fields.push("quantity", "username");
    return fields;
  }
  if (value.includes("mentions user") || value.includes("user follower") || value.includes("media liker")) {
    fields.push("quantity", "username");
    return fields;
  }
  if (value.includes("poll")) {
    fields.push("quantity", "answer_number");
    return fields;
  }
  if (value.includes("invite") || value.includes("group")) {
    fields.push("quantity", "groups");
    return fields;
  }

  fields.push("quantity");
  if (dripfeed || value.includes("drip")) fields.push("drip");
  return fields;
}

export function lineCount(value?: string) {
  return (value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;
}

export function sellCharge(rate: number, type: string | undefined, quantity: number, runs = 1) {
  if (isPackageType(type)) return Number(rate);
  return (rate / 1000) * quantity * Math.max(1, runs);
}

export function compactExtras(extras: OrderExtras) {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(extras)) {
    if (value === undefined || value === "" || value === null) continue;
    out[key] = value as string | number;
  }
  return out;
}

export function extrasForFields(fields: ServiceField[], extras: OrderExtras) {
  const picked: OrderExtras = {};
  if (fields.includes("comments")) picked.comments = extras.comments;
  if (fields.includes("usernames")) picked.usernames = extras.usernames;
  if (fields.includes("keywords")) picked.keywords = extras.keywords;
  if (fields.includes("hashtag")) picked.hashtag = extras.hashtag;
  if (fields.includes("username")) picked.username = extras.username;
  if (fields.includes("groups")) picked.groups = extras.groups;
  if (fields.includes("answer_number")) picked.answer_number = extras.answer_number;
  if (fields.includes("drip") && extras.runs && extras.runs > 1) {
    picked.runs = extras.runs;
    picked.interval = extras.interval;
  }
  if (fields.includes("subscription")) {
    picked.min = extras.min;
    picked.max = extras.max;
    picked.posts = extras.posts;
    picked.old_posts = extras.old_posts;
    picked.delay = extras.delay;
    picked.expiry = extras.expiry;
  }
  return compactExtras(picked);
}
