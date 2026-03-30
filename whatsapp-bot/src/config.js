const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "..", ".env"),
});

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();
  return ["1", "true", "yes", "sim"].includes(normalized);
}

function normalizeContact(value) {
  if (!value) {
    return "";
  }

  const raw = String(value).trim();
  if (raw.includes("@")) {
    return raw.toLowerCase();
  }

  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  return `${digits}@c.us`;
}

function parseAllowedContacts(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => normalizeContact(item))
    .filter(Boolean);
}

const config = {
  apiBaseUrl: (process.env.API_BASE_URL || "http://localhost:5043").replace(/\/+$/, ""),
  clientId: process.env.WHATSAPP_CLIENT_ID || "mercado-bot",
  allowGroups: parseBoolean(process.env.ALLOW_GROUPS, false),
  allowedContacts: parseAllowedContacts(process.env.ALLOWED_CONTACTS),
};

function isAllowedSender(sender) {
  if (!sender) {
    return false;
  }

  if (config.allowedContacts.length === 0) {
    return true;
  }

  return config.allowedContacts.includes(String(sender).toLowerCase());
}

module.exports = {
  config,
  isAllowedSender,
};
