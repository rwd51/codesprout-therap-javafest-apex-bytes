import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

//redux
import { connect } from "react-redux";
import { updateList,setPrevCode, initializeAllLists } from "../../redux/midarea/actions";
import { setCharacterList } from "../../redux/character/actions";

//MUI
import {
  IconButton,
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Avatar,
  Tooltip,
} from "@mui/material";

//components
import CustomRoundedButton from "../../../../misc/CustomRoundedButton";
import CustomRoundedTextField from "../../../../misc/CustomRoundedTextField";
import Loading from "../../../../misc/Loading";
import TypingIndicator from "../../../../misc/TypingIndicator";

//icons
import { ImMagicWand } from "react-icons/im";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CodeSproutIcon from "../../../../misc/CodeSproutIcon";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../../../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../../../../values/Button";
import { OPEN_AI_URI, USER_SERVICE_URI } from "../../../../../env";

const defaultMessageBox = (
  setShowProjectGenerationUserInputBlock,
  handleAutoCompleteCode,
  default_val = true,
  error = false,
  selection = false
) => {
  return (
    <>
      <Typography>
        {error
          ? "Sorry. I cannot help you with that. I am only equipped with the following functionalities"
          : default_val
          ? "Hello there, I am Sprout. Your personal Coding Assistant. How may I help you?"
          : `My Pleasure. What${selection ? "" : " else"} may I help you with?`}
      </Typography>
      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <CustomRoundedButton
          textColor={textColor}
          textColorOnHover={textColorOnHover}
          backgroundColor={buttonBackgroundColor}
          backgroundColorOnHover={buttonBackgroundColorOnHover}
          borderRadius={buttonBorderRadius}
          label="Generate A Project"
          handleClick={() => {
            setShowProjectGenerationUserInputBlock(true);
          }}
        />
        <CustomRoundedButton
          textColor={textColor}
          textColorOnHover={textColorOnHover}
          backgroundColor={buttonBackgroundColor}
          backgroundColorOnHover={buttonBackgroundColorOnHover}
          borderRadius={buttonBorderRadius}
          label="Autocomplete Current Code"
          handleClick={() => {
            handleAutoCompleteCode();
          }}
        />
      </div>
    </>
  );
};

const messageAfterAutoCodeGeneration = (
  handleKeepSuggestion,
  handleRevertBack,
  handleGenerateAgain
) => {
  return (
    <>
      <Typography>
        I have generated a suggestion code for you. Would you next like to -
      </Typography>
      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <CustomRoundedButton
          textColor={textColor}
          textColorOnHover={textColorOnHover}
          backgroundColor={buttonBackgroundColor}
          backgroundColorOnHover={buttonBackgroundColorOnHover}
          borderRadius={buttonBorderRadius}
          label="Keep the Suggestion"
          handleClick={handleKeepSuggestion}
        />
        <CustomRoundedButton
          textColor={textColor}
          textColorOnHover={textColorOnHover}
          backgroundColor={buttonBackgroundColor}
          backgroundColorOnHover={buttonBackgroundColorOnHover}
          borderRadius={buttonBorderRadius}
          label="Revert Back to Original"
          handleClick={handleRevertBack}
        />
        <CustomRoundedButton
          textColor={textColor}
          textColorOnHover={textColorOnHover}
          backgroundColor={buttonBackgroundColor}
          backgroundColorOnHover={buttonBackgroundColorOnHover}
          borderRadius={buttonBorderRadius}
          label="Redo the Autogeneration"
          handleClick={handleGenerateAgain}
        />
      </div>
    </>
  );
};

const projectGenerationInputItem = (
  inputLabel,
  targetName,
  handleGenerateProjectInputChange,
  inputs,
  numberInput = false
) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center", // This ensures vertical alignment
        //border: "2px solid black",
        gap: "1rem",
        paddingLeft: 1,
        paddingRight: 1,
        //paddingTop: 20,
        "&:hover": {
          color: "white",
          bgcolor: "#334B71",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "25%",
        }}
      >
        <Typography fontWeight="bold" fontFamily={CONTENT} fontSize={13}>
          {inputLabel}
        </Typography>
      </div>

      <div
        style={{
          width: "70%",
          display: "flex",
          //alignItems: "center",
          //border: "2px solid red",
          //height: "100%",
          paddingTop: 17,
        }}
      >
        <CustomRoundedTextField
          placeholder={inputLabel}
          height="0.15rem"
          name={targetName}
          value={inputs[targetName]}
          backgroundColor="white"
          borderRadius="30px"
          colorOnFocus="black"
          handleInputChange={(e) => handleGenerateProjectInputChange(e)}
          type={numberInput ? "number" : "text"}
          min={1} //ensuring that the number of characters is non-negative
          // onKeyDown={() => {}}
        />
      </div>
    </Box>
  );
};

const projectGenerationUserInputBlock = (
  handleGenerateProjectInputChange,
  inputs
) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "30px",
          overflow: "hidden",
          backgroundColor: "#aef2fc",
        }}
      >
        {[
          ["Prompt", "prompt"],
          ["Project Name", "projectName"],
          ["Project Description", "projectDescription"],
          ["Number of Characters", "numCharacters"],
        ].map(
          (inputLabel) => {
            return inputLabel[0] === "Number of Characters"
              ? projectGenerationInputItem(
                  inputLabel[0],
                  inputLabel[1],
                  handleGenerateProjectInputChange,
                  inputs,
                  true
                )
              : projectGenerationInputItem(
                  inputLabel[0],
                  inputLabel[1],
                  handleGenerateProjectInputChange,
                  inputs
                );
          } // Return the JSX here
        )}
      </div>
    </>
  );
};

const projectGenerationUserInputChatBoxItem = (label, value) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <Typography fontWeight="bold" fontFamily={TITLE} fontSize={13}>
        {label}
      </Typography>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "20px",
          p: 1,
          color: "black",
        }}
      >
        <Typography
          fontFamily={CONTENT}
          fontSize={13}
          width={200}
          sx={{
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {value}
        </Typography>
      </Box>
    </div>
  );
};

const projectGenerationUserInputChatBox = (generateProjectParamBody) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {projectGenerationUserInputChatBoxItem(
        "Prompt",
        generateProjectParamBody.prompt
      )}
      {projectGenerationUserInputChatBoxItem(
        "Project Name",
        generateProjectParamBody.projectName
      )}
      {projectGenerationUserInputChatBoxItem(
        "Project Description",
        generateProjectParamBody.projectDescription
      )}
      {projectGenerationUserInputChatBoxItem(
        "Number of Characters",
        generateProjectParamBody.numCharacters
      )}
    </div>
  );
};

//fetching auto generated project
const fetchAutoGeneratedProject = async (paramBody) => {
  console.log(paramBody);
  try {
    const res = await fetch(`${OPEN_AI_URI}/project/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paramBody),
    });

    const parseRes = await res.json();
    if (res.ok) {
      console.log(parseRes);
      return parseRes;
    } else {
    }
  } catch (err) {
    console.log(err.message);
  }
};

//fetching auto generated project
const fetchAutoGeneratedCode = async (paramBody) => {
  console.log(paramBody);
  try {
    const res = await fetch(`${OPEN_AI_URI}/codingAssistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paramBody),
    });

    const parseRes = await res.json();
    if (res.ok) {
      console.log(parseRes);
      return parseRes;
    } else {
    }
  } catch (err) {
    console.log(err.message);
  }
};

const checkPrompt = async (prompt) => {
  try {
    const res = await fetch(`${OPEN_AI_URI}/checkPrompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: prompt }),
    });

    const parseRes = await res.json();
    if (res.ok) {
      console.log(parseRes);
      return parseRes;
    } else {
    }
  } catch (err) {
    console.log(err.message);
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
    console.error(err.message);
  }
};

function MiniChatbot({
  update_list,
  character,
  complist,
  isCodeLoading,
  setIsCodeLoading,
  set_prev_code,
  isProblem = false,
  set_character_list,
  initialize_all_lists
}) {
  const { userID } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [userDetails, setUserDetails] = useState(null);
  const [isChecking, setIsChecking] =useState(false);

  const [
    showProjectGenerationUserInputBlock,
    setShowProjectGenerationUserInputBlock,
  ] = useState(false);

  const [generateProjectInput, setGenerateProjectInput] = useState({
    prompt: "",
    projectName: "",
    projectDescription: "",
    userId: userID,
    numCharacters: "",
  });

  const { prompt, projectName, projectDescription, numCharacters } =
    generateProjectInput;

  const handleGenerateProjectInputChange = (e) => {
    setGenerateProjectInput({
      ...generateProjectInput,
      [e.target.name]: e.target.value,
    });
  };

  //autocomplete code
  // const prevCode = useRef(null);
  const handleAutoCompleteCode = () => {
    setIsCodeLoading(true);
    const index = parseInt(
      character.active.id.charAt(character.active.id.length - 1)
    ); //getting the index of the active character

    // Store the previous state in a variable
    const prevList = JSON.parse(JSON.stringify(complist.midAreaLists[index])); // Capture previous list synchronously
    console.log(prevList);

    // Set the previous state using set_prev_code
    set_prev_code(prevList);

    fetchAutoGeneratedCode(complist.midAreaLists[index])
      .then((updated_list) => {
        update_list(`midAreaList-${index}`, updated_list);
        setIsCodeLoading(false);

        console.log(complist);

        setMessages([
          ...messages,
          {
            text: messageAfterAutoCodeGeneration(
              handleKeepSuggestion,
              handleRevertBack,
              handleGenerateAgain
            ),
            sender: "bot",
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(complist);
  }, [complist]);

  const handleKeepSuggestion = () => {
    set_prev_code(null);
    setMessages([
      ...messages.slice(0, messages.length - 1), // Keep all elements except the last one
      {
        text: defaultMessageBox(
          setShowProjectGenerationUserInputBlock,
          handleAutoCompleteCode,
          false,
          false
        ),
        sender: "bot",
      },
    ]);
  };

  const handleRevertBack = () => {
    // const index = parseInt(
    //   character.active.id.charAt(character.active.id.length - 1)
    // ); //getting the index of the active character
    console.log(complist);

    // update_list(`midAreaList-${index}`, complist.prevCode);

    // setMessages([
    //   ...messages.slice(0, messages.length - 1), // Keep all elements except the last one
    //   {
    //     text: defaultMessageBox(
    //       setShowProjectGenerationUserInputBlock,
    //       handleAutoCompleteCode,
    //       false
    //     ),
    //     sender: "bot",
    //   },
    // ]);

    // set_prev_code(null);
  };

  const handleGenerateAgain = () => {
    setIsCodeLoading(true);
    const index = parseInt(
      character.active.id.charAt(character.active.id.length - 1)
    ); //getting the index of the active character

    fetchAutoGeneratedCode(complist.prevCode)
      .then((updated_list) => {
        update_list(`midAreaList-${index}`, updated_list);
        setIsCodeLoading(false);

        setMessages([
          ...messages,
          {
            text: messageAfterAutoCodeGeneration(
              handleKeepSuggestion,
              handleRevertBack,
              handleGenerateAgain
            ),
            sender: "bot",
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUserDetails(userID)
      .then((user) => {
        setUserDetails(user);
      })
      .catch((err) => {
        console.log(err);
      });

    setMessages([
      ...messages,
      {
        text: defaultMessageBox(
          setShowProjectGenerationUserInputBlock,
          handleAutoCompleteCode
        ),
        sender: "bot",
      },
    ]);
  }, [userID]);

  useEffect(() => {
    console.log(generateProjectInput);
  }, [generateProjectInput]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (showProjectGenerationUserInputBlock) {
      setIsCodeLoading(true);
      fetchAutoGeneratedProject(generateProjectInput)
        .then((generatedProject) => {
          console.log(generatedProject);
          initialize_all_lists(generatedProject.midAreaLists)
          set_character_list(generatedProject.characters, generatedProject.active)
          setMessages([
            ...messages,
            {
              text: projectGenerationUserInputChatBox(generateProjectInput),
              sender: "user",
            },
          ]);
          setShowProjectGenerationUserInputBlock(false);
          setIsCodeLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (input.trim()) {
      setIsChecking(true);
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simulate bot response
      // setTimeout(() => {
      //   setMessages((messages) => [
      //     ...messages,
      //     { text: "Echo: " + input, sender: "bot" },
      //   ]);
      // }, 500);
      checkPrompt(input.trim())
        .then((check) => {
          setIsChecking(false);
          if (check.check === "yes") {
            setMessages([
              ...messages,
              {
                text: defaultMessageBox(
                  setShowProjectGenerationUserInputBlock,
                  handleAutoCompleteCode,
                  false,
                  false,
                  true
                ),
                sender: "bot",
              },
            ]);
          } else {
            //no
            setMessages([
              ...messages,
              {
                text: defaultMessageBox(
                  setShowProjectGenerationUserInputBlock,
                  handleAutoCompleteCode,
                  true,
                  true
                ),
                sender: "bot",
              },
            ]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        borderRadius: "20px",
        border: isOpen ? "3px solid black" : "none",
        overflow: "hidden",
      }}
    >
      {isOpen ? (
        <Box
          sx={{
            width: 530,
            border: 1,
            borderColor: "grey.300",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              border: 1,
              borderColor: "grey.300",
              bgcolor: "#faf7d2",
            }}
          >
            {/* <IconButton onClick={handleToggle} sx={{ position: 'absolute', top: 5, right: 5 }}>
                        <MinimizeIcon />
                    </IconButton> */}
            <Tooltip title="Minimize">
              <IconButton
                variant="contained"
                color="primary"
                onClick={handleToggle} // Reference the function you'll define next
                sx={{
                  marginTop: "10px",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  minWidth: "50px",
                  minHeight: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  color: "#334B71",
                  position: "absolute", ///
                  top: 3, ///
                  right: 10, ///
                  pb: 1.7,
                  backgroundColor: "#93db81",
                  "&:hover": {
                    backgroundColor: "#334B71",
                    color: "white",
                  },
                  "&.Mui-disabled": {
                    color: "#334B71",
                    backgroundColor: "#f0f0f0",
                    opacity: 0.7,
                  },
                }}
              >
                <MinimizeIcon />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h5"
              fontFamily={CONTENT}
              fontWeight="bold"
              gutterBottom
              sx={{ padding: 2 }}
            >
              Coding Assistant
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              minHeight: "100px",
              maxHeight: showProjectGenerationUserInputBlock ? 160 : 400,
              overflow: "auto",
              bgcolor: "#eaffe6",
            }}
          >
            <List>
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {message.sender === "bot" && (
                    <Avatar sx={{ marginRight: 1 }}>
                      <CodeSproutIcon />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      padding: 1,
                      bgcolor: message.sender === "user" ? "#334B71" : "black",
                      color: "white",
                      borderRadius: 1,
                      maxWidth: message.sender === "user" ? "80%" : "70%",
                      borderRadius: "30px",
                      p: 2,
                    }}
                  >
                    {/* <Typography
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    > */}
                    {message.text}
                    {/* </Typography> */}
                  </Box>

                  {message.sender === "user" && (
                    <Avatar
                      src={`${window.location.origin}/avatars/avatars_list/${userDetails.photo}.svg`}
                      sx={{ marginLeft: 1, backgroundColor: "black" }}
                    />
                  )}
                </ListItem>
              ))}
              {
              isChecking && (
                <ListItem
                key="checking"
                sx={{
                  display: "flex",
                  justifyContent:
                     "flex-start",
                }}
              >
                  <Avatar sx={{ marginRight: 1 }}>
                    <CodeSproutIcon />
                  </Avatar>

                <Box
                  sx={{
                    padding: 1,
                    bgcolor: "black",
                    color: "white",
                    borderRadius: 1,
                    maxWidth: "70%",
                    borderRadius: "30px",
                    p: 2,
                  }}
                >
                  <TypingIndicator />
                </Box>
              </ListItem>
              )
            }
            </List>
            
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                p: 1,
                bgcolor: "#faf7d2",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <div style={{ marginTop: "20px", width: "80%" }}>
                {showProjectGenerationUserInputBlock ? (
                  projectGenerationUserInputBlock(
                    handleGenerateProjectInputChange,
                    generateProjectInput
                  )
                ) : (
                  <CustomRoundedTextField
                    placeholder="How may I help you?"
                    value={input}
                    backgroundColor="white"
                    borderRadius="30px"
                    colorOnFocus="black"
                    handleInputChange={handleMessageChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                <CustomRoundedButton
                  textColor={textColor}
                  textColorOnHover={textColorOnHover}
                  backgroundColor={buttonBackgroundColor}
                  backgroundColorOnHover={buttonBackgroundColorOnHover}
                  borderRadius={buttonBorderRadius}
                  label="SEND"
                  handleClick={handleSendMessage}
                />
                {showProjectGenerationUserInputBlock && (
                  <CustomRoundedButton
                    textColor={textColor}
                    textColorOnHover={textColorOnHover}
                    backgroundColor={buttonBackgroundColor}
                    backgroundColorOnHover={buttonBackgroundColorOnHover}
                    borderRadius={buttonBorderRadius}
                    label="BACK"
                    handleClick={() =>
                      setShowProjectGenerationUserInputBlock(false)
                    }
                  />
                )}
              </div>
            </Box>
          </Box>
          {isCodeLoading && (
            <div
              style={{
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                top: 0,
                left: 0,
                opacity: 0.7,
                width: "100%",
                height: "100%",
                zIndex: 3000,
                pointerEvents: "all",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Loading
                spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
                sprinnerWidth="250px"
                spinnerHeight="250px"
                spinnerImageWidth="200px"
                spinnerImageHefight="200px"
                spinnerColor="#334B71"
                spinnerBackgroundColor="#ebfdff"
              />
            </div>
          )}
        </Box>
      ) : (
        <Tooltip
          title={
            isProblem
              ? "Coding Assistant not Accessible While Solving Problems"
              : "Coding Assistant"
          }
        >
          <IconButton
            variant="contained"
            color="primary"
            onClick={isProblem ? () => {} : handleToggle} // Reference the function you'll define next
            sx={{
              marginTop: "10px",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              minWidth: "50px",
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              color: "#334B71",
              backgroundColor: isProblem ? "#cccaca" : "#93db81",
              "&:hover": {
                backgroundColor: isProblem ? "black" : "#334B71",
                color: "white",
              },
              "&.Mui-disabled": {
                color: "#334B71",
                backgroundColor: "#f0f0f0",
                opacity: 0.7,
              },
            }}
          >
            <ImMagicWand />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

// mapping state to props
const mapStateToProps = (state) => {
  return {
    complist: state.list,
    character: state.character,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    update_list: (id, new_list) => dispatch(updateList(id, new_list)),
    set_prev_code: (prevCode) => dispatch(setPrevCode(prevCode)),
    set_character_list: (characterList, activeCharacter) => dispatch(setCharacterList(characterList, activeCharacter)),
    initialize_all_lists: (midAreaLists) => dispatch(initializeAllLists(midAreaLists))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MiniChatbot);
