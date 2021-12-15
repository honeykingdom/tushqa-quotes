import assert from "assert";
import path from "path";
import fs from "fs";
import { createHash } from "crypto";
import dotenv from "dotenv";
import { parseISO } from "date-fns";
import getQuoteCount from "./utils/getQuoteCount";
import getQuoteDate from "./utils/getQuoteDate";
import parseMessageParts from "./utils/parseMessageParts";
import filterQuotes from "../src/utils/filterQuotes";
import { RawQuoteType } from "../src/types";

dotenv.config();

type ParsedQuote = RawQuoteType & {
  match: string[];
};

type Message = {
  text: string;
  timestamp: string;
  count: number;
};

const iterateUserMessages = (
  folder: string,
  channel: string,
  user: string,
  fn: (text: string, date: string, time: string) => void
) => {
  const quoteRegex = RegExp(`^\\[(\\d{2}:\\d{2}:\\d{2})\\]  ${user}: (.+)$`);
  const filenameRegex = RegExp(`^${channel}-(\\d{4}-\\d{2}-\\d{2})\\.log$`);

  const files = fs.readdirSync(folder);

  files.forEach((file) => {
    const m = filenameRegex.exec(file);

    if (!m) return;

    const date = m[1];

    const content = fs.readFileSync(path.resolve(folder, file), "utf8");

    const lines = content.split("\n");

    lines.forEach((line) => {
      const m = quoteRegex.exec(line);

      if (!m) return;

      const time = m[1];
      const text = m[2];

      fn(text, date, time);
    });
  });
};

const main = () => {
  const channels = process.env.PARSED_CHANNELS!.split(";");
  const twitchLogsFolder = process.env.TWITCH_LOGS_FOLDER!;

  const logFolders = channels.map((channel) =>
    path.join(twitchLogsFolder, channel)
  );

  const quotes: ParsedQuote[] = fs
    .readFileSync("./data/quotes.md", "utf8")
    .replace(/\\\*/g, "*")
    .split("\n\n")
    .reverse()
    .map((s) => s.trim())
    .filter((s) => !s.startsWith("<!--") && !s.startsWith("## "))
    .map((text) => {
      const match = text.split("\n").map((s) => s.trim());
      const message = match[0];
      const messageParts = parseMessageParts(message);

      return {
        id: createHash("md5").update(message).digest("hex"),
        message,
        messageParts,
        match,
        channels: [],
        timestamp: 0,
        count: 0,
      };
    });

  logFolders.forEach((logFolder) => {
    const channel = path.parse(logFolder).name;
    const messages: Message[] = [];

    iterateUserMessages(logFolder, channel, "tushqa", (text, date, time) => {
      const normalizedText = text.replace(/\s+/g, " ");
      const isTextIncluded = (q: ParsedQuote) =>
        q.match.some((matchText) => normalizedText.includes(matchText));
      const quote = quotes.find(isTextIncluded);

      try {
        assert(quotes.filter(isTextIncluded).length <= 1, text);
      } catch (e) {
        console.log(e.message);
      }

      if (quote) {
        const timestamp = parseISO(`${date}T${time}`).getTime();

        const quoteChannel = quote.channels.find((ch) => ch.name === channel);

        if (quoteChannel) {
          quoteChannel.count += 1;
          quoteChannel.timestamps?.push(timestamp);
        } else {
          quote.channels.push({
            name: channel,
            timestamps: [timestamp],
            count: 1,
          });
        }
      }

      const message = messages.find((m) => m.text === text);

      if (message) {
        message.count += 1;
      } else {
        messages.push({
          text,
          timestamp: `${date} ${time}`,
          count: 1,
        });
      }
    });

    fs.writeFileSync(
      `./data/messages.${channel}.json`,
      JSON.stringify(
        messages.filter((m) => m.count > 1),
        null,
        2
      )
    );
  });

  const newQuotes: RawQuoteType[] = quotes.map(({ match, ...quote }) => ({
    ...quote,
    count: getQuoteCount(quote),
    timestamp: getQuoteDate(quote),
  }));

  const filterOptions = {
    minCount: 0,
    sortBy: "date",
    sortOrder: "desc",
  } as const;

  const filteredQuotes = filterQuotes<RawQuoteType>(newQuotes, filterOptions);

  const sortedQuotes: RawQuoteType[] = filteredQuotes.map((quote) => ({
    ...quote,
    channels: quote.channels.map(({ timestamps, ...channel }) => channel),
  }));

  fs.writeFileSync("./data/quotes.json", JSON.stringify(sortedQuotes, null, 2));
};

main();
