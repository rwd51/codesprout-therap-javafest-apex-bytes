import React, { useEffect, useState } from "react";
import "./CodeEditor/index.css";
import CodeEditor from "./CodeEditor/CodeEditor";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "tailwindcss/tailwind.css";
import { Provider } from "react-redux";
import store from "./CodeEditor/store";
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

function CodeEditorPage({setLoadingScreen}) {
  

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  return (
    <div style={{ paddingBottom: 10}}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SnackbarProvider maxSnack={4}>
            <CodeEditor setLoadingScreen={setLoadingScreen} />
          </SnackbarProvider>
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default CodeEditorPage;
