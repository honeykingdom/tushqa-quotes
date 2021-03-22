import type { RawQuoteType } from "types";

const getQuoteDate = (quote: RawQuoteType) =>
  Math.min(...quote.channels.map((channel) => channel.timestamps?.[0] || 0));

export default getQuoteDate;
