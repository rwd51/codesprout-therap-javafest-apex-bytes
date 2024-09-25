import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./CodeEditor";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "tailwindcss/tailwind.css";
import { Provider } from "react-redux";
import store from "./store";
import { SnackbarProvider } from "notistack";

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6", // Example primary color
    },
    secondary: {
      main: "#19857b", // Example secondary color
    },
    error: {
      main: "#ff1744",
    },
    background: {
      default: "#fff",
      paper: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontSize: "2.2rem",
    },
    h2: {
      fontSize: "1.8rem",
    },
    button: {
      textTransform: "none",
    },
  },
  spacing: 8, // Default spacing
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <SnackbarProvider maxSnack={4}>
          <App />
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
