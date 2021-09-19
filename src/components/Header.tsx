import styled from "@emotion/styled";
import { signIn, signOut, useSession } from "next-auth/client";
import {
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  Tooltip,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Hidden,
  Button,
} from "@mui/material";
import DarkThemeIcon from "@mui/icons-material/Brightness7";
import LightThemeIcon from "@mui/icons-material/Brightness4";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import TwitchIcon from "icons/twitch";
import { useState } from "react";
import SEO from "../../next-seo.config";

const Logo = styled.img`
  margin-right: 12px;
  width: 24px;
  height: 24px;
`;
const StyledToolbar = styled(Toolbar)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;
const HiddenMenu = styled(Hidden)`
  margin-left: auto;
`;
const HiddenMenuIcon = styled(Hidden)`
  margin-left: auto;
`;
const HiddenMobileMenu = styled(Hidden)`
  width: 100%;
`;

const GITHUB_REPOSITORY_URL = "//github.com/honeykingdom/tushqa-quotes";
const GITHUB_REPOSITORY_CAPTION = "Репозиторий на GitHub";
const THEME_SWITCHER_CAPTION = "Тёмная/светлая тема";
const TWITCH_SIGN_IN_CAPTION = "Войти через Twitch";

type Props = {
  toggleTheme: () => void;
};

const Header = ({ toggleTheme }: Props) => {
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const theme = useTheme();
  const [session, loading] = useSession();

  const themeIcon =
    theme.palette.mode === "dark" ? <LightThemeIcon /> : <DarkThemeIcon />;

  const signInButton = (
    <Button
      variant="contained"
      // @ts-expect-error
      color="fourthly"
      onClick={() => signIn("twitch")}
    >
      <TwitchIcon style={{ width: 16 }} />
      &nbsp; {TWITCH_SIGN_IN_CAPTION}
    </Button>
  );

  const signOutButton = (
    // @ts-expect-error
    <Button variant="contained" color="fourthly" onClick={() => signOut()}>
      Выйти
    </Button>
  );

  const menu = (
    <Typography
      color="textPrimary"
      component="div"
      display="flex"
      alignItems="center"
    >
      <Tooltip title={THEME_SWITCHER_CAPTION}>
        <IconButton
          color="inherit"
          sx={{ mr: 1 }}
          onClick={toggleTheme}
          size="large"
        >
          {themeIcon}
        </IconButton>
      </Tooltip>
      <Tooltip title={GITHUB_REPOSITORY_CAPTION}>
        <IconButton
          color="inherit"
          sx={{ mr: 1 }}
          href={GITHUB_REPOSITORY_URL}
          target="_blank"
          rel="noreferrer noopener"
          size="large"
        >
          <GitHubIcon />
        </IconButton>
      </Tooltip>

      {!loading && (
        <>
          {!session && (
            <Tooltip title={TWITCH_SIGN_IN_CAPTION}>{signInButton}</Tooltip>
          )}
          {session && (
            <>
              <Typography
                variant="body1"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 1,
                  p: 1,
                }}
              >
                <TwitchIcon style={{ height: 24, marginRight: 8 }} />
                &nbsp;
                <strong>{session.user?.name}</strong>
              </Typography>
              <Box sx={{ my: 1 }}>{signOutButton}</Box>
            </>
          )}
        </>
      )}
    </Typography>
  );

  const mobileMenu = (
    <List>
      <ListItem button onClick={toggleTheme}>
        <ListItemIcon>{themeIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography color="textPrimary">
              {THEME_SWITCHER_CAPTION}
            </Typography>
          }
        />
      </ListItem>
      <ListItem
        button
        component="a"
        href={GITHUB_REPOSITORY_URL}
        target="_blank"
        rel="noreferrer noopener"
      >
        <ListItemIcon>
          <GitHubIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography color="textPrimary">
              {GITHUB_REPOSITORY_CAPTION}
            </Typography>
          }
        />
      </ListItem>
      <Divider sx={{ my: 1 }} />
      {!loading && (
        <>
          {!session && (
            <ListItem>
              <ListItemText primary={signInButton} />
            </ListItem>
          )}
          {session && (
            <>
              <ListItem>
                <ListItemIcon>
                  <TwitchIcon style={{ width: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      fontWeight="bold"
                      color="textPrimary"
                      sx={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {session.user?.name}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText primary={signOutButton} />
              </ListItem>
            </>
          )}
        </>
      )}
    </List>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundImage: "none",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[400],
      }}
    >
      <StyledToolbar>
        <Box display="flex" alignItems="center">
          <Logo
            src="/favicon-32x32.png"
            srcSet="/favicon-32x32.png 1x, /android-chrome-192x192.png 2x"
            alt="😂"
          />
          <Typography
            variant="h6"
            color="textPrimary"
            component="h1"
            sx={{ py: 2, whiteSpace: "nowrap" }}
          >
            {SEO.title}
          </Typography>
        </Box>

        <HiddenMenuIcon implementation="css" mdUp>
          <IconButton
            edge="end"
            onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
            size="large"
          >
            <MenuIcon />
          </IconButton>
        </HiddenMenuIcon>

        <HiddenMenu implementation="css" mdDown>
          {menu}
        </HiddenMenu>

        <HiddenMobileMenu
          implementation="css"
          xsUp={!isMobileMenuVisible}
          mdUp={isMobileMenuVisible}
        >
          {mobileMenu}
        </HiddenMobileMenu>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;
