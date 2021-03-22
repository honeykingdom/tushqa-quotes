import type { RawQuoteType } from "types";

const getQuoteCount = (quote: RawQuoteType) =>
  quote.channels.map((channel) => channel.count).reduce((a, b) => a + b, 0);

export default getQuoteCount;
