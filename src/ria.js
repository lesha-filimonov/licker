// https://ria.ru

import puppeteer from "puppeteer";

import * as htmlparser2 from "htmlparser2";
import { Format } from "telegraf";
import "dotenv/config";

const URL = process.env.TARGET_URL;
const URN = process.env.TARGET_URN;
const SELECTOR = process.env.TARGET_SELECTOR;

export async function scrapePage() {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.goto(URL + URN, { timeout: 0 });

  const content = await page.evaluate((SELECTOR) => {
    return document.querySelector(SELECTOR).innerHTML;
  }, SELECTOR);

  await browser.close();

  return serializeContent(content);
}

function serializeContent(htmlContent) {
  const dom = htmlparser2.parseDocument(htmlContent);

  let events = [];
  events.push({
    header: dom.children[0].children[0].children[1].children[0].data,
    date: "2024-12-11",
    uri: URL + dom.children[0].attribs.href,
  });
  return events;
}

export function formatMessage(event) {
  const message = {
    header: Format.bold(event.header),
    link: Format.link("Ссылка на новость", event.uri),
  };
  return Format.join(Object.values(message), "\n");
}
