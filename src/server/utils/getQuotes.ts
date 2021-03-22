import path from "path";
import { promises as fs } from "fs";
import { QuoteType } from "../../types";

export let quotes: QuoteType[] | null = null;

export const getQuotes = async () => {
  if (!quotes) {
    const quotesPath = path.resolve(process.cwd(), "data/quotes.json");
    const quotesRaw = await fs.readFile(quotesPath, "utf8");

    quotes = JSON.parse(quotesRaw) as QuoteType[];
  }

  return quotes;
};
