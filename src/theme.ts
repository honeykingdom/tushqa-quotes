import * as R from "ramda";
import { createTheme, ThemeOptions } from "@material-ui/core/styles";

const common: ThemeOptions = {
  palette: {
    mode: "dark",
    thirdly: {
      main: "#ff69b4",
    },
    fourthly: {
      main: "#6441a5",
      contrastText: "#fff",
    },
  },
  typography: {
    htmlFontSize: 16,
  },
};

const dark: ThemeOptions = {
  // @ts-expect-error
  palette: {
    mode: "dark",
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
};
const light: ThemeOptions = {
  // @ts-expect-error
  palette: {
    mode: "light",
  },
};

const themes = {
  // @ts-expect-error
  dark: createTheme(R.mergeDeepRight(common, dark)),
  // @ts-expect-error
  light: createTheme(R.mergeDeepRight(common, light)),
};

export default themes;
