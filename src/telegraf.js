import { Telegraf, Format } from "telegraf";

const TELEGRAM_BOT_TOKEN = "7810268969:AAG52a5HZwaU-dlkxEeOUKJxUa2UdfnKrnQ";
const CHANNEL_ID = "-1002284987996";

const eventMessage = {
  header: Format.bold("Яга"),
  link: Format.link("Начата продажа билетов 🎫", "https://google.com"),
  date: "Спектакль состоится 13 ноября 19:00",
  place: "в театре Свободное пространство 🎭",
};
const formattedEventMessage = Format.join(Object.values(eventMessage), "\n");
// const formattedNews = Format.join([HEADER, LINK, DATE, THEATRE], '\n');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
await bot.telegram.sendMessage(CHANNEL_ID, formattedEventMessage);
