import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import {
  CSSReset,
  ThemeProvider,
  theme,
  ColorModeProvider,
} from "@chakra-ui/core";

import customColors from "./utils/colors";

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...customColors,
  },
  fonts: {
    body: "Open Sans, sans-serif",
    heading: "Ubuntu, sans-serif",
    mono: "Fugaz One, cursive",
    // mono: "Allura, cursive"
  },
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <ColorModeProvider>
        <CSSReset />
        <App />
      </ColorModeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
