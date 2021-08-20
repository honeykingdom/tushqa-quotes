import path from "path";
import { QuoteType } from "../../types";

export let quotes: QuoteType[] | null = null;

export const getQuotes = async () => {
  if (!quotes) {
    const quotesPath = path.resolve(process.cwd(), "data/quotes.json");

    quotes = (await import(quotesPath)) as QuoteType[];
  }

  return quotes;
};
