import styled from "@emotion/styled";
import { signIn, signOut, useSession } from "next-auth/client";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  useTheme,
  Tooltip,
  IconButton,
  Theme,
  Box,
} from "@material-ui/core";
import DarkThemeIcon from "@material-ui/icons/Brightness7";
import LightThemeIcon from "@material-ui/icons/Brightness4";
import PurpleButton from "components/PurpleButton";
import TwitchIcon from "icons/twitch";

const Logo = styled.img`
  margin-right: 12px;
  width: 24px;
  height: 24px;
`;
const StyledToolbar = styled(Toolbar)<{ theme?: Theme }>`
  display: flex;
  flex-direction: column;

  @media (min-width: ${(p) => p.theme?.breakpoints.values.sm}px) {
    flex-direction: row;
  }
`;
const Profile = styled(Typography)<{ theme?: Theme }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (min-width: ${(p) => p.theme?.breakpoints.values.sm}px) {
    margin-left: auto;
  }
`;

type Props = {
  switchTheme: () => void;
};

const Header = ({ switchTheme }: Props) => {
  const theme = useTheme();
  const [session, loading] = useSession();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[400],
      }}
    >
      <StyledToolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Logo
            src="/favicon-32x32.png"
            srcSet="/favicon-32x32.png 1x, /android-chrome-192x192.png 2x"
            alt="😂"
          />
          <Typography
            variant="h6"
            color="textPrimary"
            component="h1"
            sx={{ py: 1 }}
          >
            Цитаты Тушки
          </Typography>
        </Box>
        {/* TODO: fix component prop ts error */}
        {/* @ts-expect-error */}
        <Profile color="textPrimary" component="div">
          <Tooltip title="Тёмная/светлая тема">
            <IconButton color="inherit" sx={{ mr: 1 }} onClick={switchTheme}>
              {theme.palette.mode === "dark" ? (
                <LightThemeIcon />
              ) : (
                <DarkThemeIcon />
              )}
            </IconButton>
          </Tooltip>
          {!loading && (
            <>
              {!session && (
                <Tooltip title="Войти через Twitch">
                  <PurpleButton
                    variant="contained"
                    onClick={() => signIn("twitch")}
                  >
                    <TwitchIcon style={{ width: 16 }} />
                    &nbsp; Войти
                  </PurpleButton>
                </Tooltip>
              )}
              {session && (
                <>
                  <Typography
                    variant="body1"
                    color="inherit"
                    sx={{ display: "flex", alignItems: "center", mr: 1 }}
                  >
                    <TwitchIcon style={{ width: 20 }} />
                    &nbsp;
                    <strong>{session.user.name}</strong>
                  </Typography>
                  <Button
                    color="inherit"
                    variant="text"
                    onClick={() => signOut()}
                  >
                    Выйти
                  </Button>
                </>
              )}
            </>
          )}
        </Profile>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;
