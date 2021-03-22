import type { FiltersType, RawQuoteType, QuoteType } from "../types";

const filterQuotes = <T extends RawQuoteType = QuoteType>(
  quotes: T[],
  filters: FiltersType
): T[] => {
  const filteredQuotes = quotes
    .filter((quote) => quote.count >= filters.minCount)
    .sort((a, b) => {
      if (filters.sortBy === "date") {
        return filters.sortOrder === "asc"
          ? a.timestamp - b.timestamp
          : b.timestamp - a.timestamp;
      }

      if (filters.sortBy === "count") {
        return filters.sortOrder === "asc"
          ? a.count - b.count
          : b.count - a.count;
      }

      if (filters.sortBy === "rating") {
        return filters.sortOrder === "asc"
          ? // @ts-expect-error
            a.fullRating - b.fullRating
          : // @ts-expect-error
            b.fullRating - a.fullRating;
      }

      return 0;
    });

  return filteredQuotes;
};

export default filterQuotes;
