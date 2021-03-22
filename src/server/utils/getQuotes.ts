import { promises as fs } from "fs";
import { QuoteType } from "../../types";

export let quotes: QuoteType[] | null = null;

export const getQuotes = async () => {
  if (!quotes) {
    const quotesRaw = await fs.readFile("./data/quotes.json", "utf8");
    quotes = JSON.parse(quotesRaw) as QuoteType[];
  }

  return quotes;
};
