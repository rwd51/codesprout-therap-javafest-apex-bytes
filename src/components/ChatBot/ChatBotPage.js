import React, { useEffect } from "react";

// MUI
import { Box } from "@mui/system";

// Components
import ChatBot from "./ChatBot";

function ChatBotPage() {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  }, []);

  return (
    <div style={{ height: "850px", backgroundColor: "#f0f0f0" }}>
      <ChatBot />
    </div>
  );
}

export default ChatBotPage;
