import React, { useState, useRef, useEffect } from "react";

//MUI
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  TextField,
  Stack,
  Avatar,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";

//icons
import { RiChatNewLine } from "react-icons/ri";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import CodeSproutIcon from "../misc/CodeSproutIcon";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

//components
import Loading from "../misc/Loading";

//values
import { TITLE, CONTENT, TITLE_THICK } from "../../values/Fonts";
import { CHATBOT_URI, USER_SERVICE_URI } from "../../env";

//utils
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import { useParams } from "react-router-dom";
import TypingIndicator from "../misc/TypingIndicator";

const drawerWidth = 200;

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const chatHistory1 = {
  historyId: "66f27ca8545b407fc1362736",
  userId: "66cca5d5ea6a47411506b7c9",
  conversations: [
    {
      conversationId: "f8ebbdff-b674-413d-beb0-66a64734faa6",
      topic: null,
      messages: [
        {
          sender: "assistant",
          content:
            "Hello there! 🌟 Welcome back to our fun and exciting coding world! How can I assist you today?",
          timestamp: "2024-09-24T14:50:14.866",
        },
      ],
      startTime: "2024-09-24T14:50:13.113",
      endTime: null,
    },
    {
      conversationId: "913e1081-4951-4174-8272-7da32db24596",
      topic: "Looping concept",
      messages: [
        {
          sender: "assistant",
          content: "Hello there, coding whiz! 🚀 How can I help you today?",
          timestamp: "2024-09-24T14:52:49.104",
        },
        {
          sender: "user",
          content: "Tell me how can I repeat a action five times here",
          timestamp: "2024-09-24T14:56:09.441",
        },
        {
          sender: "assistant",
          content:
            'To repeat an action five times in the gamified learning app, you can use the "Repeat" block. This block allows you to create a loop that executes a specified block of actions a set number of times. \n\nTo repeat an action five times, you would simply drag and drop the "Repeat" block onto the workspace and set the number of repetitions to 5. Then, you would place the actions you want to repeat inside the "Repeat" block. \n\nFor example, if you want to move an object forward 50 pixels five times, you would drag the "Move" block (with 50 pixels specified) inside the "Repeat" block and set the number of repetitions to 5.\n\nThis way, the action inside the "Repeat" block will be executed five times, allowing you to repeat the desired action.',
          timestamp: "2024-09-24T14:56:12.015",
        },
        {
          sender: "user",
          content:
            "Wow , so i can repeat multiple tasks , multiple times here?",
          timestamp: "2024-09-24T15:09:24.122",
        },
        {
          sender: "assistant",
          content:
            'Yes, you can definitely repeat multiple tasks multiple times using the "Repeat" block in the gamified learning app. \n\nYou can nest multiple blocks within a single "Repeat" block to execute a sequence of actions repeatedly. This allows you to create more complex and varied loops to achieve different outcomes in your program.\n\nFor example, you can move an object forward, rotate it, change its size, and display a message within a single loop by placing these blocks inside the "Repeat" block. \n\nBy nesting blocks within the "Repeat" block, you can create more intricate and dynamic interactions in your program, making the learning experience more engaging and educational for kids.',
          timestamp: "2024-09-24T15:09:24.122",
        },
      ],
      startTime: "2024-09-24T14:52:48.032",
      endTime: null,
    },
  ],
};

// Desired time groups
const TIME_GROUPS = [
  "Today",
  "Yesterday",
  "Previous 7 Days",
  "More Than a Week",
];

// Function to determine the time group based on the date
function getTimeGroup(date, currentDate) {
  const diffTime = currentDate - date;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 1) return "Today";
  if (diffDays < 2) return "Yesterday";
  if (diffDays < 7) return "Previous 7 Days";
  return "More Than a Week";
}

// Modified Function to format the history with reversed message and reply order
// Includes only conversationId
function formatHistory(history2) {
  const history = [];
  const currentDate = new Date(); // Use the actual current date

  // Initialize time groups
  TIME_GROUPS.forEach((group) => {
    history.push({
      time: group,
      messages: [],
    });
  });

  // Helper function to find the appropriate time group
  function findTimeGroup(date) {
    const now = new Date();
    const diffTime = now - date;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 1) return "Today";
    if (diffDays < 2) return "Yesterday";
    if (diffDays < 7) return "Previous 7 Days";
    return "More Than a Week";
  }

  history2.conversations.forEach((conv) => {
    const startDate = new Date(conv.startTime);
    const group = findTimeGroup(startDate);

    // Prepare the title
    const title = conv.topic ? conv.topic : "New Chat";

    const allmessages = [];
    const messages = conv.messages;
    let i = 0;

    while (i < messages.length) {
      const msg = messages[i];
      if (msg.sender === "user") {
        // Look for the next assistant message as reply
        let reply = null;
        for (let j = i + 1; j < messages.length; j++) {
          if (messages[j].sender === "assistant") {
            reply = messages[j].content;
            i = j; // Move the outer loop index to skip the assistant message
            break;
          }
        }
        allmessages.push({
          message: msg.content,
          reply: reply,
        });
      } else if (msg.sender === "assistant") {
        // Check if this assistant message has a preceding user message
        // If not, set message to null and reply to assistant message
        const hasPrecedingUser = i > 0 && messages[i - 1].sender === "user";
        if (!hasPrecedingUser) {
          allmessages.push({
            message: null,
            reply: msg.content,
          });
        }
        // If there is a preceding user message, it's already handled in the user block
      }
      i++;
    }

    // Find the time group in history and add the messages
    const timeGroup = history.find((hg) => hg.time === group);
    if (timeGroup) {
      timeGroup.messages.push({
        conversationId: conv.conversationId, // Include conversationId
        title: title,
        allmessages: allmessages,
      });
    }
  });

  return history;
}

const flattenMessageArray = (messageArray) => {
  let newMessageArray = [];
  messageArray.map((message, index) => {
    newMessageArray.push(
      { text: message.message, sender: "user" },
      { text: message.reply, sender: "bot" }
    );
  });
  return newMessageArray;
};

const buildMessageArray = (flattenedMessageArray) => {
  let messageArray = [];
  for (let i = 0; i < flattenedMessageArray.length; i += 2) {
    messageArray.push({
      message: flattenedMessageArray[i],
      reply: flattenedMessageArray[i + 1],
    });
  }
  return messageArray;
};

function getConversationDetails(formattedHistory, conversationId) {
  for (
    let timeGroupIndex = 0;
    timeGroupIndex < formattedHistory.length;
    timeGroupIndex++
  ) {
    const timeGroup = formattedHistory[timeGroupIndex];
    const messages = timeGroup.messages;

    for (let messageIndex = 0; messageIndex < messages.length; messageIndex++) {
      const messageGroup = messages[messageIndex];

      if (messageGroup.conversationId === conversationId) {
        return {
          time: timeGroup.time,
          index: messageIndex,
          allmessages: messageGroup.allmessages,
        };
      }
    }
  }

  // If the conversationId is not found in any time group
  return null;
}

//fetching conversation history
const fetchConversationHistory = async (userID) => {
  try {
    const res = await fetch(`${CHATBOT_URI}/history/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    });

    const parseRes = await res.json();
    if (res.ok) {
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

//greet with chatbot
const greetWithChatBot = async (userID, historyID) => {
  try {
    const res = await fetch(`${CHATBOT_URI}/greet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'token': localStorage.token
      },
      body: JSON.stringify({ userId: userID, historyId: historyID }),
    });

    //const parseRes = await res.json();

    if (res.ok) {
      return res;
    } else {
    }
  } catch (err) {
    console.error("Error fetching /*...*/", err.message);
  }
};

//continue with chatbot
const continueConversationWithChatBot = async (
  userID,
  conversationID,
  historyID,
  initialMessage
) => {
  try {
    const res = await fetch(`${CHATBOT_URI}/continue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'token': localStorage.token
      },
      body: JSON.stringify({
        userId: userID,
        initialMessage: initialMessage,
        conversationId: conversationID,
        historyId: historyID,
      }),
    });

    //const parseRes = await res.json();

    if (res.ok) {
      return res;
    } else {
    }
  } catch (err) {
    console.error("Error fetching /*...*/", err.message);
  }
};

//initiate conversation
const initiateConversation = async (
  userID,
  conversationID,
  historyID,
  initialMessage
) => {
  try {
    console.log("Calling initialize: ", {
      userId: userID,
      initialMessage: initialMessage,
      conversationId: conversationID,
      historyId: historyID,
    });
    const res = await fetch(`${CHATBOT_URI}/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'token': localStorage.token
      },
      body: JSON.stringify({
        userId: userID,
        initialMessage: initialMessage,
        conversationId: conversationID,
        historyId: historyID,
      }),
    });

    //const parseRes = await res.json();

    if (res.ok) {
      return res;
    } else {
    }
  } catch (err) {
    console.error("Error fetching /*...*/", err.message);
  }
};

//function to fetch details of a particular user
const fetchUserDetails = async (userID) => {
  try {
    const res = await fetch(`${USER_SERVICE_URI}/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    });

    const parseRes = await res.json();

    if (res.ok) {
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error("Failed to fetch user details:", err.message);
  }
};

function ChatBot() {
  const { userID } = useParams();
  const [userDetails, setUserDetails] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);

  const [allMessages, setAllMessages] = useState([]);

  const [chatHistory, setChatHistory] = useState(null);
  const [history, setHistory] = useState(null);
  //const [fetchHistory, setFetchHistory] = useState(false);
  const [currentConversationID, setCurrentConversationID] = useState(null);

  const [selectedMessageFromHistory, setSelectedMessageFromHistory] =
    useState(null);

  useEffect(() => {
    fetchConversationHistory(userID)
      .then((conversationHistory) => {
        console.log(conversationHistory);
        setChatHistory(conversationHistory);
        setHistory(formatHistory(conversationHistory));

        if (conversationHistory.conversations.length === 0) {
          greetWithChatBot(userID, conversationHistory.historyId)
            .then((res) => {
              fetchConversationHistory(userID)
                .then((newConversationHistory) => {
                  const newHistory = formatHistory(newConversationHistory);
                  const selectedMessages =
                    newHistory[0].messages[0].allmessages;
                  const time = newHistory[0].time;
                  const index = 0;

                  setCurrentConversationID(
                    newHistory[0].messages[0].conversationId
                  );

                  const flattenedMessageArray =
                    flattenMessageArray(selectedMessages);
                  setMessages(flattenedMessageArray);
                  setInput("");
                  setAllMessages(buildMessageArray(flattenedMessageArray));

                  setSelectedMessageFromHistory({ time: time, index: index });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          const newHistory = formatHistory(conversationHistory);
          const selectedMessages = newHistory[0].messages[0].allmessages;
          const time = newHistory[0].time;
          const index = 0;

          setCurrentConversationID(newHistory[0].messages[0].conversationId);

          const flattenedMessageArray = flattenMessageArray(selectedMessages);
          setMessages(flattenedMessageArray);
          setInput("");
          setAllMessages(buildMessageArray(flattenedMessageArray));

          setSelectedMessageFromHistory({ time: time, index: index });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    fetchUserDetails(userID)
      .then((user) => {
        setUserDetails(user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID]);

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const sendMessage = (conversationID) => {
    if (input.trim()) {
      // setMessages([...messages, { text: input, sender: "user" }]);
      // setTimeout(() => {
      //   setMessages((msgs) => [
      //     ...msgs,
      //     { text: "This is a response from ChatBot.", sender: "bot" },
      //   ]);
      // }, 500);
      // setAllMessages([
      //   ...allMessages,
      //   {
      //     message: input,
      //     reply: "This is a response from ChatBot.",
      //   },
      // ]);
      // setInput("");
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setIsSendingMessage(true);

      const selectedMessageDetails = getConversationDetails(
        history,
        currentConversationID
      );
      console.log(history);
      console.log(currentConversationID);
      console.log(selectedMessageDetails);
      if (selectedMessageDetails.allmessages.length === 1) {
        initiateConversation(
          userID,
          conversationID,
          chatHistory.historyId,
          input.trim()
        )
          .then((res) => {
            console.log("intializing...");
            // setAllMessages([
            //   ...allMessages,
            //   {
            //     message: input,
            //     reply: "This is a response from ChatBot.",
            //   },
            // ]);
            fetchConversationHistory(userID)
              .then((conversationHistory) => {
                setChatHistory(conversationHistory);
                setHistory(formatHistory(conversationHistory));

                const newHistory = formatHistory(conversationHistory);
                const selectedMessageDetails = getConversationDetails(
                  newHistory,
                  conversationID
                );
                const selectedMessages = selectedMessageDetails.allmessages;
                const time = selectedMessageDetails.time;
                const index = selectedMessageDetails.index;

                const flattenedMessageArray =
                  flattenMessageArray(selectedMessages);
                setMessages(flattenedMessageArray);
                setInput("");
                setAllMessages(buildMessageArray(flattenedMessageArray));
                setSelectedMessageFromHistory({ time: time, index: index });

                setIsSendingMessage(false);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (messages.length > 1) {
        continueConversationWithChatBot(
          userID,
          conversationID,
          chatHistory.historyId,
          input.trim()
        )
          .then((res) => {
            setMessages([...messages, { text: input, sender: "user" }]);
            // setAllMessages([
            //   ...allMessages,
            //   {
            //     message: input,
            //     reply: "This is a response from ChatBot.",
            //   },
            // ]);
            fetchConversationHistory(userID)
              .then((conversationHistory) => {
                setChatHistory(conversationHistory);
                setHistory(formatHistory(conversationHistory));

                const newHistory = formatHistory(conversationHistory);
                const selectedMessageDetails = getConversationDetails(
                  newHistory,
                  conversationID
                );
                const selectedMessages = selectedMessageDetails.allmessages;
                const time = selectedMessageDetails.time;
                const index = selectedMessageDetails.index;

                const flattenedMessageArray =
                  flattenMessageArray(selectedMessages);
                setMessages(flattenedMessageArray);
                setInput("");
                setAllMessages(buildMessageArray(flattenedMessageArray));
                setSelectedMessageFromHistory({ time: time, index: index });

                setIsSendingMessage(false);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleKeyDown = (e, conversationID) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(conversationID);
    }
  };

  const onHistoryMenuItemClick = (time, index, conversationID) => {
    const selectedMessages = history.find((message) => message.time === time)
      ?.messages[index];
    const flattenedMessageArray = flattenMessageArray(
      selectedMessages.allmessages
    );
    setMessages(flattenedMessageArray);
    setInput("");
    setAllMessages(buildMessageArray(flattenedMessageArray));

    setSelectedMessageFromHistory({ time: time, index: index });

    setCurrentConversationID(conversationID);
  };

  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);

  const handleNewChatClick = () => {
    // setMessages([]);
    // setInput("");
    // setAllMessages([]);
    // setSelectedMessageFromHistory(null);
    setIsCreatingNewChat(true);

    fetchConversationHistory(userID)
      .then((conversationHistory) => {
        // if (conversationHistory.conversations.length === 0) {

        // } else {

        // }
        greetWithChatBot(userID, conversationHistory.historyId)
          .then((res) => {
            fetchConversationHistory(userID)
              .then((newConversationHistory) => {
                // setMessages([]);
                // setInput("");
                // setAllMessages([]);
                // setSelectedMessageFromHistory(null);

                // setMessages(flattenedMessageArray);
                // setInput("");
                // setAllMessages(buildMessageArray(flattenedMessageArray));
                setChatHistory(newConversationHistory);
                setHistory(formatHistory(newConversationHistory));

                const newHistory = formatHistory(newConversationHistory);
                const selectedMessages =
                  newHistory[0].messages[newHistory[0].messages.length - 1];
                const time = newHistory[0].time;
                const index = newHistory[0].messages.length - 1;

                const flattenedMessageArray = flattenMessageArray(
                  selectedMessages.allmessages
                );
                setMessages(flattenedMessageArray);
                setInput("");
                setAllMessages(buildMessageArray(flattenedMessageArray));
                setSelectedMessageFromHistory({ time: time, index: index });

                setCurrentConversationID(selectedMessages.conversationId);

                setIsCreatingNewChat(false);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //ADD and DELETE chats
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [currentItem, setCurrentItem] = useState(null);

  // const menuOpenRef = useRef(false);

  // const handleMenuOpen = (event, time, index) => {
  //   event.stopPropagation(); // Prevents the ListItem onClick from firing
  //   setAnchorEl(event.currentTarget);
  //   menuOpenRef.current = true;
  //   setCurrentItem({
  //     time,
  //     index,
  //     title: history.find((h) => h.time === time)?.messages[index].title,
  //   }); // Set current item to manage actions like rename or delete
  // };

  // const handleClose = () => {
  //   setTimeout(() => {
  //     menuOpenRef.current = false;
  //   }, 100); // Delay the ref update slightly
  //   setAnchorEl(null);
  // };

  // const [isEditing, setIsEditing] = useState(false);
  // const [editValue, setEditValue] = useState("");
  // const handleRename = (time, index) => {
  //   setIsEditing(true);
  //   const selectedMessage = history.find((message) => message.time === time)
  //     ?.messages[index];
  //   if (selectedMessage) {
  //     setEditValue(selectedMessage.title); // Assuming title is the attribute you want to edit
  //   }
  //   handleClose();
  //   // setCurrentItem({ time, index });
  // };

  // const handleRenameEnterClick = (e, time, index) => {
  //   if (e.key === "Enter") {
  //     setIsEditing(false);
  //     setEditValue("");
  //     setCurrentItem({ time, index });
  //   }
  // };

  // const handleBlur = (event) => {
  //   //blur logic to set focus away from the rename textfield
  //   if (!menuOpenRef.current) {
  //     setIsEditing(false);
  //   }
  // };

  // const handleDelete = () => {
  //   // Implement your delete logic here
  //   console.log("Delete:", currentItem);
  //   handleClose();
  // };

  // const textFieldRef = useRef(null);

  // useEffect(() => {
  //   // Check if the text field should be focused and if the ref is attached
  //   if (textFieldRef.current && isEditing) {
  //     textFieldRef.current.focus();
  //   }
  // }, [isEditing]);

  //handling speech recognition
  //speech to text
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const timeoutRef = useRef(null);

  // Stop listening after 10 seconds of inactivity
  const stopListeningAfterInactivity = () => {
    timeoutRef.current = setTimeout(() => {
      if (listening) {
        SpeechRecognition.stopListening();
        setInput(transcript);
        resetTranscript();
        console.log("Stopped listening due to inactivity");
      }
    }, 10000);
  };

  // Reset the inactivity timer whenever speech input is received
  useEffect(() => {
    if (listening) {
      // Clear the existing timer if new speech input is detected
      clearTimeout(timeoutRef.current);
      stopListeningAfterInactivity();
    }
  }, [transcript, listening]);

  const startListening = () => {
    SpeechRecognition.startListening();
    stopListeningAfterInactivity(); // Start the inactivity timer when listening starts
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    clearTimeout(timeoutRef.current); // Clear the inactivity timer if listening stops manually
    setInput(transcript);
    //resetTranscript();
  };

  //text to speech
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [girlyVoiceIndices, setGirlyVoiceIndices] = useState([]);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  // Find indices of female-sounding voices
  useEffect(() => {
    if (voices.length > 0) {
      const indices = voices
        .map((voice, index) =>
          /female|woman|girl/i.test(voice.name) ? index : null
        )
        .filter((index) => index !== null);
      setGirlyVoiceIndices(indices);

      // Set the first "girly" voice by default
      if (indices.length > 0) {
        setVoiceIndex(indices[0]);
      }
    }
  }, [voices]);

  const handleSpeak = (text, index) => {
    if (text && supported) {
      setSpeakingIndex(index);
      console.log(voices[voiceIndex]);
      speak({ text, voice: voices[voiceIndex] });
    }
  };

  const handleCancel = () => {
    cancel();
    setSpeakingIndex(null);
  };

  return (
    //<ThemeProvider theme={theme}>
    //<CssBaseline />
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Box
        sx={{
          width: "70%",
          height: "80%",
          display: "flex",
          border: "5px solid black",
          position: "relative",
          backgroundColor: "#dce3da",
          overflow: "hidden",
          marginTop: "-5%",
          borderRadius: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.9)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url(/ChatBot/image-1.gif)", // Add your background image here
            backgroundSize: "auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.5, // Change the opacity of the background image
          },
        }}
      >
        <AppBar
          position="absolute"
          sx={{
            width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
            transition: "width 0.3s",
            zIndex: 500,
            backgroundColor: "#c4e3bc",
          }}
        >
          <Toolbar>
            <IconButton
              color="black"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{
                marginRight: 2,
                "&:hover": { color: "white", backgroundColor: "#334B71" },
              }}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              display="flex"
              gap="1rem"
              alignItems="center"
              fontWeight="bold"
              color="black"
              fontFamily={TITLE}
            >
              {!drawerOpen && (
                <IconButton
                  sx={{
                    "&:hover": { color: "white", backgroundColor: "#859c80" },
                  }}
                  onClick={handleNewChatClick}
                >
                  <RiChatNewLine style={{ fontSize: "24px" }} />
                </IconButton>
              )}
              <CodeSproutIcon /> ChatBot
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              position: "absolute",
              height: "100%",
              zIndex: 500,
              backgroundColor: "#c3dae3",
              overflow: "hidden", // Disable overflow here
            },
          }}
          anchor="left"
        >
          <List>
            <ListItem
              button
              key={`new-chat`}
              sx={{
                "&:hover": {
                  backgroundColor: "#334B71",
                  "& .MuiListItemText-primary": {
                    color: "white",
                  },
                  "& svg": {
                    color: "white",
                  },
                },
              }}
              onClick={handleNewChatClick}
            >
              <ListItemText
                primary={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography fontFamily={CONTENT} fontWeight="bold">
                      New Chat
                    </Typography>{" "}
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <RiChatNewLine style={{ fontSize: "24px" }} />
                    </div>{" "}
                  </div>
                }
              />
            </ListItem>
          </List>
          <div style={{ overflowY: "auto" }}>
            {history &&
              history.map((message) => (
                <>
                  <Typography
                    fontFamily={TITLE}
                    fontWeight="bold"
                    paddingLeft="10px"
                    sx={{
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds shadow for an elevated effect
                      backgroundColor: "#dfebf0", // Optional: background color to make the shadow stand out
                      padding: "5px", // Optional: padding to provide some space around the text
                      //borderRadius: "5px", // Optional: rounding the corners
                    }}
                  >
                    {message.time}
                  </Typography>

                  <List>
                    {message.messages.map((m, index) => (
                      <ListItem
                        button
                        key={`${message.time}-${index}`} // Ensure keys are unique by combining time and index
                        sx={{
                          backgroundColor:
                            selectedMessageFromHistory &&
                            message.time === selectedMessageFromHistory.time &&
                            index === selectedMessageFromHistory.index
                              ? "#b0bec5"
                              : "transparent",

                          "& .MuiInput-underline:after": {
                            // Targets the underline of the input field when focused (for underlined variant)
                            borderBottomColor: "black", // Change to your desired color
                          },
                          // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          //   // Targets the outline when the TextField is focused (for outlined variant)
                          //   borderColor: 'white', // Change to your desired color
                          // },
                          "&:hover": {
                            backgroundColor: "#334B71",
                            "& .MuiListItemText-primary": {
                              color: "white",
                            },
                            "& .MuiIconButton-root": {
                              // Targets IconButton
                              color: "white",
                            },
                            ".MuiInputBase-input": {
                              color: "white", //text color on hover
                            },
                            //   ".MuiOutlinedInput-notchedOutline": {
                            //     borderColor: "white", // Change outline color on hover
                            //   },
                            "& .MuiInput-underline:after": {
                              //  underline after focused (funderlined variant)
                              borderBottomColor: "white",
                            },
                            "& .MuiInput-underline:before": {
                              //underline before focused (underlined variant)
                              borderBottomColor: "white",
                            },
                          },
                          display: "flex", // Make sure the ListItem is using flex layout
                          justifyContent: "space-between", // Space between the text and the icon
                          alignItems: "center",
                        }}
                        onClick={() =>
                          onHistoryMenuItemClick(
                            message.time,
                            index,
                            m.conversationId
                          )
                        }
                      >
                        {/* {currentItem &&
                      currentItem.time === message.time &&
                      currentItem.index === index &&
                      isEditing ? (
                        <TextField
                          value={editValue}
                          focused={true}
                          onChange={(e) => setEditValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={handleBlur}
                          onKeyPress={(e) =>
                            handleRenameEnterClick(
                              e,
                              currentItem.time,
                              currentItem.index
                            )
                          }
                          sx={{
                            width: "100%", // Ensure TextField takes full width

                            //change color of underline when hovered over
                          }}
                          inputRef={textFieldRef} // Attach the ref to the input element
                          autoFocus={true} // Helps initially but rely on ref for re-focusing
                          fullWidth
                          variant="standard"
                        />
                      ) : ( */}
                        <ListItemText
                          primary={m.title}
                          primaryTypographyProps={{
                            fontFamily: CONTENT,
                          }}
                        />
                        {/* )} */}
                        {/* <ListItemIcon sx={{ minWidth: "auto" }}>
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent ListItem onClick from triggering when clicking the icon
                            handleMenuOpen(event, message.time, index);
                          }} // Open menu function needs to be created
                          sx={{
                            color: "transparent", // Initially hide the icon by setting its color to transparent
                            "&:hover": {
                              color: "inherit", // Ensure the icon only shows on hover of the IconButton itself if needed
                              backgroundColor: "#596e91",
                            },
                          }}
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </ListItemIcon> */}
                      </ListItem>
                    ))}
                  </List>
                </>
              ))}
            {/* <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: "20ch",
                  backgroundColor: "#dde8ed",
                },
              }}
            >
              <MenuItem
                onClick={(event) => {
                  event.stopPropagation(); // Prevent onBlur from being called
                  handleRename(currentItem.time, currentItem.index);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#334B71", // Change to your desired hover background color
                    color: "#ffffff", // Change text color on hover
                  },
                }}
              >
                Rename
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  event.stopPropagation(); // Prevent onBlur from being called
                  handleDelete();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#334B71", // Change to your desired hover background color
                    color: "#ffffff", // Change text color on hover
                  },
                }}
              >
                Delete
              </MenuItem>
            </Menu> */}
          </div>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            marginLeft: drawerOpen ? `${drawerWidth / 10}px` : -10,
            marginRight: drawerOpen
              ? `${drawerWidth / 5}px`
              : `${drawerWidth / 2}px`,
            overflowY: "auto",
            paddingTop: "64px",
          }}
        >
          <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 3 }}>
            {messages.map(
              (msg, index) =>
                msg.text && (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    sx={{
                      justifyContent:
                        msg.sender === "user" ? "flex-end" : "flex-start",
                      margin: "10px",
                    }}
                  >
                    {msg.sender === "bot" && <CodeSproutIcon />}
                    {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
                    <Box
                      sx={{
                        padding: "10px 20px",
                        borderRadius: "20px",
                        backgroundColor:
                          msg.sender === "user" ? "#3a5f7d" : "#424242",
                        color: "white",
                        maxWidth: "70%",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.text}
                    </Box>
                    {msg.sender === "bot" && (
                      <div>
                        <Tooltip
                          title={
                            speakingIndex === index ? "Speaking..." : "Listen"
                          }
                        >
                          <IconButton
                            sx={{
                              bgcolor:
                                speakingIndex === index ? "black" : "#faf4ca",
                              color: speakingIndex === index ? "red" : "black",
                              "&:hover": {
                                bgcolor: "black",
                                color:
                                  speakingIndex === index ? "red" : "white",
                              },
                            }}
                            onClick={() => {
                              speakingIndex === index
                                ? handleCancel()
                                : handleSpeak(msg.text, index);
                            }}
                          >
                            <HiOutlineSpeakerWave />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                    {/* </div> */}
                    {msg.sender === "user" && (
                      <Avatar
                        src={`${window.location.origin}/avatars/avatars_list/${userDetails.photo}.svg`}
                        sx={{ bgcolor: "#3a5f7d" }}
                      />
                    )}
                  </Stack>
                )
            )}
            {isSendingMessage && (
              <Stack
                key="sending-message"
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "flex-start",
                  margin: "10px",
                }}
              >
                <CodeSproutIcon />
                {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
                <Box
                  sx={{
                    padding: "10px 20px",
                    borderRadius: "20px",
                    backgroundColor: "#424242",
                    color: "white",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <TypingIndicator />
                </Box>
              </Stack>
            )}
          </Box>
          <Box
            sx={{
              padding: 3,
              backgroundColor: "#dce3da",
              display: "flex",
              alignItems: "center",
              position: "sticky",
              bottom: 0,
              zIndex: 1200,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              multiline
              maxRows={7}
              placeholder="Type your message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, currentConversationID)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "40px",
                  backgroundColor: "#c5c9c3",
                  // Applying styles for the normal state
                  //border: '1px solid red', // Makes the border red by default
                  "&.Mui-focused fieldset": {
                    borderColor: "#000", // Keeps the border red when the field is focused
                  },
                  "&:hover": {
                    backgroundColor: "#b2b8b0", // Change this to your preferred hover background color
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#b2b8b0", // Change this to your preferred active background color
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* <Tooltip title="Attach File">
                      <IconButton
                        sx={{
                          color: "#334B71",
                          "&:hover": {
                            color: "white",
                            backgroundColor: "#334B71",
                          },
                        }}
                      >
                        <AttachFileIcon />
                      </IconButton>
                    </Tooltip> */}
                    <Tooltip title="Speak">
                      <IconButton
                        sx={{
                          color: listening ? "red" : "#334B71",
                          bgcolor: listening ? "black" : "transparent",
                          "&:hover": {
                            color: listening ? "red" : "white",
                            backgroundColor: listening ? "black" : "#334B71",
                          },
                        }}
                        onClick={() => {
                          listening ? stopListening() : startListening();
                        }}
                      >
                        <MicIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Send">
                      <IconButton
                        onClick={() => sendMessage(currentConversationID)}
                        sx={{
                          color: "#334B71",
                          "&:hover": {
                            color: "white",
                            backgroundColor: "#334B71",
                          },
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        {!history ||
          (isCreatingNewChat && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                backgroundColor: "white",
                opacity: 0.5,
                zIndex: 20000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loading
                spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
                sprinnerWidth="250px"
                spinnerHeight="250px"
                spinnerImageWidth="200px"
                spinnerImageHeight="200px"
                spinnerColor="#334B71"
                spinnerBackgroundColor="#ebfdff"
              />
            </div>
          ))}
        {/* <img
          style={{
            position: "absolute",
            width: "350px",
            height: "auto",
            top: 120,
            left: 330,
            opacity: 0.3,
            zIndex: -1,
          }}
          src={`${window.location.origin}/ChatBot/image-1.gif`}
        /> */}
      </Box>
    </Box>
    //</ThemeProvider>
  );
}

export default ChatBot;
