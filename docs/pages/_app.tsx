import "../styles/globals.scss";
import { ThemeProvider } from "@emotion/react";
import type { AppProps } from "next/app";

const lightTheme = {
  background: "var(--color-bg)",
  text: "var(--color-text)",
};

const darkTheme = {
  background: "var(--color-bg-dark)",
  text: "var(--color-text-dark)",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;