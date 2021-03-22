import { useCallback, useState } from "react";
import * as R from "ramda";
import { Container, Box } from "@material-ui/core";
import { useSession } from "next-auth/client";
import Header from "components/Header";
import QuoteCard from "components/QuoteCard";
import Filters from "components/Filters";
import SignInModal from "components/SignInModal";
import filterQuotes from "utils/filterQuotes";
import { usePostRatingQuery } from "generated/graphql";
import type { FiltersType, RawQuoteType, QuoteType } from "types";

import quotes from "../../data/quotes.json";

export const defaultFilters: FiltersType = {
  sortBy: "date",
  sortOrder: "desc",
  minCount: 0,
};

type Props = {
  switchTheme: () => void;
};

const Home = ({ switchTheme }: Props) => {
  const [session, authLoading] = useSession();
  const [filters, setFilters] = useState<FiltersType>(defaultFilters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = useCallback(() => setIsModalOpen(true), []);
  const handleClose = useCallback(() => setIsModalOpen(false), []);

  const { data, loading } = usePostRatingQuery();

  const modifiedQuotes: QuoteType[] = (quotes as RawQuoteType[]).map(
    (quote) => {
      const postRatingEntry = data?.postRating.find(
        R.propEq("postId", quote.id)
      );

      const fullRating = postRatingEntry?.fullRating || 0;
      const userRating = postRatingEntry?.userRating ?? null;

      return {
        ...quote,
        fullRating,
        userRating,
      };
    }
  );

  const renderedQuotes = filterQuotes(modifiedQuotes, filters);

  const isDisabled = authLoading || loading;

  return (
    <>
      <Header switchTheme={switchTheme} />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Filters changeFilters={setFilters} />
          {renderedQuotes.map((quote) => (
            <Box sx={{ mb: 2 }} key={quote.id}>
              <QuoteCard
                {...quote}
                isDisabled={isDisabled}
                isAuth={!!session}
                onOpenSignInModal={handleOpen}
              />
            </Box>
          ))}
        </Box>
      </Container>
      <SignInModal open={isModalOpen} onClose={handleClose} />
    </>
  );
};

export default Home;
