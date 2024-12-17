import sqlite from "sqlite3";
import { Telegraf } from "telegraf";
import cron from "node-cron";

import { getSecrets } from "./secrets.js";
import { execute } from "./sqlite.js";
import { scrapePage, formatMessage } from "./ria.js";
import "dotenv/config";

console.info(new Date().toISOString(), "The service is starting");
console.debug(new Date().toISOString(), "Show debug messages");

const SQLITE3_FILE_PATH = process.env.SQLITE3_FILE_PATH;
const { TELEGRAM_BOT_TOKEN, CHANNEL_ID } = JSON.parse(await getSecrets());

let db;
try {
  sqlite.verbose();
  db = new sqlite.Database(SQLITE3_FILE_PATH);
} catch (e) {
  console.error(e);
}

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    header TEXT NOT NULL,
    datetime TEXT,
    uri VARCHAR(2048) NOT NULL UNIQUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`);
});

cron.schedule("*/15 * * * * *", async () => {
  let events;
  try {
    events = await scrapePage();
    console.debug(new Date().toISOString(), "Events", events);
  } catch (e) {
    console.error(e);
  }

  for (const event of events) {
    try {
      await execute(
        db,
        `INSERT INTO Events (header, datetime, uri) VALUES ('${event.header}', '${event.date}', '${event.uri}')`
      );
      const logTimestamp = new Date().toISOString();
      console.group(logTimestamp, "New event");
      console.debug(event);
      console.groupEnd(logTimestamp);
      const formattedMessage = formatMessage(event);
      const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
      await bot.telegram.sendMessage(CHANNEL_ID, formattedMessage);
    } catch (e) {
      if (e.code !== "SQLITE_CONSTRAINT") console.error(e);
    }
  }
});

// Enable graceful stop
process.once("SIGINT", () => {
  console.info(new Date().toISOString(), "SIGINT received, stopping");
  db.close();
  process.exit(0);
});
process.once("SIGTERM", () => {
  console.info(new Date().toISOString(), "SIGTERM received, stopping");
  db.close();
  process.exit(0);
});
