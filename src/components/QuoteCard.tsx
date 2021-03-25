import { Fragment, useMemo, memo } from "react";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import styled from "@emotion/styled";
import { ApolloCache, gql } from "@apollo/client";
import {
  IconButton,
  Card,
  Typography,
  Paper,
  Box,
  useTheme,
} from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import type { MessagePart, QuoteType } from "types";
import plural from "utils/plural";
import {
  PostRating,
  UpdateRatingMutation,
  useUpdateRatingMutation,
} from "generated/graphql";

const CardInner = styled.div`
  display: flex;
`;
const EmoteWrapper = styled.span`
  display: inline-block;
`;
const Emoji = styled.img`
  display: inline-block;
  margin-top: -5px;
  margin-bottom: -4px;
  width: 20px;
  height: auto;
  vertical-align: middle;
`;
const Emote = styled.img`
  display: inline-block;
  margin: -5px 0;
  vertical-align: middle;
`;

export const TWITCH_EMOTES_CDN = "//static-cdn.jtvnw.net/emoticons/v1";
export const BTTV_EMOTES_CDN = "//cdn.betterttv.net/emote";
export const FFZ_EMOTES_CDN = "//cdn.frankerfacez.com/emoticon";

const renderMessageParts = (messageParts: MessagePart[]) =>
  messageParts.map((item, key) => {
    if (typeof item === "string") return item;

    if (item[0] === "twitch") {
      const [, id, name] = item;
      const src = `${TWITCH_EMOTES_CDN}/${id}/1.0`;
      const srcSet = `${TWITCH_EMOTES_CDN}/${id}/1.0 1x, ${TWITCH_EMOTES_CDN}/${id}/2.0 2x, ${TWITCH_EMOTES_CDN}/${id}/3.0 4x`;

      return (
        <EmoteWrapper key={key}>
          <Emote src={src} srcSet={srcSet} alt={name} title={name} />
        </EmoteWrapper>
      );
    }

    if (item[0] === "bttv") {
      const [, id, name] = item;
      const src = `${BTTV_EMOTES_CDN}/${id}/1x`;
      const srcSet = `${BTTV_EMOTES_CDN}/${id}/2x 2x, ${BTTV_EMOTES_CDN}/${id}/3x 4x`;

      return (
        <EmoteWrapper key={key}>
          <Emote src={src} srcSet={srcSet} alt={name} title={name} />
        </EmoteWrapper>
      );
    }

    if (item[0] === "ffz") {
      const [, id, name] = item;
      const src = `${FFZ_EMOTES_CDN}/${id}/1`;
      const srcSet = `${FFZ_EMOTES_CDN}/${id}/2 2x, ${FFZ_EMOTES_CDN}/${id}/3 4x`;

      return (
        <EmoteWrapper key={key}>
          <Emote src={src} srcSet={srcSet} alt={name} title={name} />
        </EmoteWrapper>
      );
    }

    if (item[0] === "emoji") {
      const [, short, unified] = item;
      const name = `:${short}:`;
      const src = `//twemoji.maxcdn.com/v/latest/72x72/${unified}.png`;

      return (
        <EmoteWrapper key={key}>
          <Emoji src={src} alt={name} title={name} />
        </EmoteWrapper>
      );
    }

    return null;
  });

const updateAfterVote = (
  postId: string,
  prevUserRating: number,
  newUserRating: number
) => (cache: ApolloCache<UpdateRatingMutation>) => {
  const POST_RATING_FRAGMENT = gql`
    fragment _ on PostRating {
      postId
      fullRating
      userRating
    }
  `;

  const POST_RATING_ID = cache.identify({ __typename: "PostRating", postId });

  let postRatingFragment = cache.readFragment<PostRating>({
    id: POST_RATING_ID,
    fragment: POST_RATING_FRAGMENT,
  });

  if (!postRatingFragment) {
    postRatingFragment = {
      __typename: "PostRating",
      postId,
      fullRating: newUserRating,
      userRating: newUserRating,
    };

    cache.modify({
      fields: {
        postRating: (postRatingRefs = []) => {
          const newPostRatingRef = cache.writeFragment<PostRating>({
            id: POST_RATING_ID,
            fragment: POST_RATING_FRAGMENT,
            data: postRatingFragment!,
          });

          return [...postRatingRefs, newPostRatingRef];
        },
      },
    });

    return;
  }

  if (prevUserRating !== newUserRating) {
    const diff = -prevUserRating + newUserRating;

    cache.modify({
      id: POST_RATING_ID,
      fields: {
        fullRating: (prevFullRating) => prevFullRating + diff,
        userRating: () => newUserRating,
      },
    });
  }
};

const timesLabels = ["раз", "раза", "раз"] as [string, string, string];

type Props = QuoteType & {
  isDisabled: boolean;
  isAuth: boolean;
  onOpenSignInModal: () => void;
};

const QuoteCard = ({
  id: postId,
  messageParts,
  channels,
  timestamp,
  count,
  fullRating,
  userRating,
  isDisabled,
  isAuth,
  onOpenSignInModal,
}: Props) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [updateRating] = useUpdateRatingMutation({
    onError: () =>
      enqueueSnackbar("Ошибка. Сервер не отвечает", {
        variant: "error",
        autoHideDuration: 3000,
      }),
  });
  const date = format(timestamp, "P");

  const userRatingValue = userRating || 0;
  const isUpVoted = userRatingValue > 0;
  const isDownVoted = userRatingValue < 0;

  const handleUpVote = () => {
    if (!isAuth) {
      onOpenSignInModal();

      return;
    }

    const value = isUpVoted ? 0 : 1;

    updateRating({
      variables: { data: { postId, value } },
      optimisticResponse: {
        updateRating: { __typename: "Rating", postId, value },
      },
      update: updateAfterVote(postId, userRatingValue, value),
    });
  };

  const handleDownVote = () => {
    if (!isAuth) {
      onOpenSignInModal();

      return;
    }

    const value = isDownVoted ? 0 : -1;

    updateRating({
      variables: { data: { postId, value } },
      optimisticResponse: {
        updateRating: { __typename: "Rating", postId, value },
      },
      update: updateAfterVote(postId, userRatingValue, value),
    });
  };

  const renderRating = () => (
    <Typography
      color="textSecondary"
      component="div"
      sx={{
        py: 2,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <IconButton
        size="small"
        color={isUpVoted ? "secondary" : "inherit"}
        disabled={isDisabled}
        onClick={handleUpVote}
      >
        <ArrowUpwardIcon />
      </IconButton>
      <Typography color={isUpVoted || isDownVoted ? "secondary" : "inherit"}>
        {fullRating}
      </Typography>
      <IconButton
        size="small"
        color={isDownVoted ? "secondary" : "inherit"}
        disabled={isDisabled}
        onClick={handleDownVote}
      >
        <ArrowDownwardIcon />
      </IconButton>
    </Typography>
  );

  const quoteElement = useMemo(
    () => (
      <Box sx={{ p: 2, pl: 0, flexGrow: 1 }}>
        <Paper
          sx={{
            p: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.grey[50],
          }}
        >
          <Typography color="secondary" component="span" fontWeight="bold">
            Tushqa
          </Typography>
          : {renderMessageParts(messageParts)}
        </Paper>
        <Box sx={{ pt: 1 }}>
          <Typography color="textSecondary" variant="caption" sx={{ mr: 1 }}>
            {date}
          </Typography>
          <Typography color="textSecondary" variant="caption" sx={{ mr: 0 }}>
            {channels.length === 1 && (
              <>
                Отправлена в&nbsp;чат {channels[0].name}{" "}
                <Typography
                  color="textPrimary"
                  variant="inherit"
                  component="strong"
                >
                  {count}
                </Typography>
                &nbsp;
                {plural(count, timesLabels)}.
              </>
            )}
            {channels.length > 1 && (
              <>
                Отправлена в&nbsp;чат{" "}
                <Typography
                  color="textPrimary"
                  variant="inherit"
                  component="strong"
                >
                  {count}
                </Typography>
                &nbsp;
                {plural(count, timesLabels)}:{" "}
                {channels.map((channel, i) => (
                  <Fragment key={channel.name}>
                    {channel.name} <strong>{channel.count}</strong>
                    &nbsp;
                    {plural(channel.count, timesLabels)}
                    {i === channels.length - 1 ? "" : ", "}
                  </Fragment>
                ))}
                .
              </>
            )}
          </Typography>
        </Box>
      </Box>
    ),
    [messageParts, date, channels, count, theme.palette.mode]
  );

  return (
    <Card>
      <CardInner>
        {renderRating()}
        {quoteElement}
      </CardInner>
    </Card>
  );
};

export default memo(QuoteCard);
