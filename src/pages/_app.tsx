import { useState, useMemo, useCallback } from "react";
import Head from "next/head";
import { AppProps, NextWebVitalsMetric } from "next/app";
import { Provider as AuthProvider } from "next-auth/client";
import { DefaultSeo } from "next-seo";
// import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import { CssBaseline, PaletteMode } from "@material-ui/core";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { CacheProvider } from "@emotion/react";
import themes from "theme";
import { useApollo } from "apolloClient";
import SEO from "../../next-seo.config";
import { cache } from "./_document";

const App = ({ Component, pageProps }: AppProps) => {
  const [paletteMode, setPaletteMode] = useState<PaletteMode>("dark");
  const apolloClient = useApollo(pageProps);

  const theme = useMemo(() => themes[paletteMode], [paletteMode]);

  const toggleTheme = useCallback(() => {
    setPaletteMode(paletteMode === "dark" ? "light" : "dark");
  }, [paletteMode]);

  return (
    <CacheProvider value={cache}>
      <Head>
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <ThemeProvider theme={theme}>
        <AuthProvider
          session={pageProps.session}
          options={{ keepAlive: Infinity, clientMaxAge: Infinity }}
        >
          <ApolloProvider client={apolloClient}>
            {/* <SnackbarProvider maxSnack={1}> */}
            <DefaultSeo {...SEO} />
            <CssBaseline />
            <Component {...pageProps} toggleTheme={toggleTheme} />
            {/* </SnackbarProvider> */}
          </ApolloProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export const reportWebVitals = ({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) => {
  window.gtag("event", name, {
    event_category:
      label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  });
};

export default App;
