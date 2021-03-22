import { useState, useEffect, useMemo, useCallback } from "react";
import * as R from "ramda";
import Head from "next/head";
import { AppProps } from "next/app";
import { Provider as AuthProvider } from "next-auth/client";
import { DefaultSeo } from "next-seo";
import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import { CssBaseline, PaletteMode } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import defaultTheme from "theme";
import { useApollo } from "apolloClient";
import SEO from "../../next-seo.config";

export const cache = createCache({ key: "css", prepend: true });

export default function MyApp({ Component, pageProps }: AppProps) {
  const [paletteMode, setPaletteMode] = useState<PaletteMode>("dark");
  const apolloClient = useApollo(pageProps);

  const theme = useMemo(
    () =>
      createMuiTheme(
        R.mergeDeepRight(defaultTheme, { palette: { mode: paletteMode } })
      ),
    [paletteMode]
  );

  const switchTheme = useCallback(() => {
    setPaletteMode(paletteMode === "dark" ? "light" : "dark");
  }, [paletteMode]);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  // TODO: remove this
  useEffect(() => {
    if (typeof window !== "undefined") {
      const body = document.querySelector("body");

      body!.style.backgroundColor = theme.palette.background.default;
    }
  }, [paletteMode]);

  return (
    <CacheProvider value={cache}>
      <Head>
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ThemeProvider theme={theme}>
        <AuthProvider session={pageProps.session}>
          <ApolloProvider client={apolloClient}>
            <SnackbarProvider maxSnack={1}>
              <DefaultSeo {...SEO} />
              <CssBaseline />
              <Component {...pageProps} switchTheme={switchTheme} />
            </SnackbarProvider>
          </ApolloProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
