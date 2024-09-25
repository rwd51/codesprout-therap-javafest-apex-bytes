import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";

//MUI
import {
  Card,
  CardContent,
  CardMedia,
  Link,
  Box,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";

//icons
import { FaPlay } from "react-icons/fa";

//components
import CustomRoundedButton from "../misc/CustomRoundedButton";
import Loading from "../misc/Loading";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";
import { USER_SERVICE_URI } from "../../env";

//utils
import { useSpeechSynthesis } from "react-speech-kit";

//function to fetch user details
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

function ProblemCard({ problem }) {
  const { userID } = useParams();

  const [userDetails, setUserDetails] = useState(null);

  useState(() => {
    fetchUserDetails(userID)
      .then((user) => {
        setUserDetails(user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID]);

  //text to speech
  const problemStatement = problem.story + " Your task is to " + problem.task;
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [girlyVoiceIndices, setGirlyVoiceIndices] = useState([]);

  const [isSpeakingChunk, setIsSpeakingChunk] = useState(false);

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

  const chunkStringByWords = (inputString) => {
    const words = inputString.split(/\s+/);

    const result = [];

    for (let i = 0; i < words.length; i += 10) {
      const chunk = words.slice(i, i + 10).join(" ");
      result.push(chunk);
    }

    return result;
  };

  // const handleSpeak = (text) => {
  //   if (text && supported) {
  //     console.log(voices[voiceIndex]);
  //     const textChunks = chunkStringByWords(text);
  //     textChunks.forEach((element) => {
  //       console.log(element);
  //       speak({
  //         text: element,
  //         voice: voices[voiceIndex],
  //       });
  //     });
  //   }
  // };

  // const handleSpeak = (text) => {
  //   if (text && supported) {
  //     const textChunks = chunkStringByWords(text);
  //     let lastChunk = textChunks.length - 1;

  //     setIsSpeakingChunk(true);

  //     textChunks.forEach((chunk, index) => {
  //       speak({
  //         text: chunk,
  //         voice: voices[voiceIndex],
  //         onend: () => {
  //           // If this is the last chunk, then call handleCancel
  //           if (index === lastChunk) {
  //             handleCancel();
  //           }
  //         },
  //       });
  //     });
  //   }
  // };

  const speakChunk = (text, voice) => {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;

      utterance.onend = resolve; // Resolves the Promise when speaking ends
      utterance.onerror = reject; // Handles speech errors

      window.speechSynthesis.speak(utterance);
    });
  };

  const handleSpeak = async (text) => {
    if (text && supported) {
      const textChunks = chunkStringByWords(text);

      setIsSpeakingChunk(true);

      try {
        for (const chunk of textChunks) {
          await speakChunk(chunk, voices[voiceIndex]); // Waits for each chunk to finish
        }
        handleCancel(); // Called once all chunks are spoken
      } catch (err) {
        console.error("Speech error:", err);
      }
    }
  };

  const handleCancel = () => {
    cancel();
    setIsSpeakingChunk(false);
  };

  const navigate = useNavigate();

  const openProblemInEditor = (userID, problemID) => {
    navigate(`/kids/${userID}/codeEditor/null/${problemID}`, { replace: true });
  };

  return (
    <Card sx={{ width: "100%", borderRadius: "30px", border: '5px solid black' }}>
        {/* {problem ? (
          <CardMedia
            component="img"
            //image={}
            alt="Post image"
            sx={{
              border: "3px solid black",
              borderRadius: "30px 30px 0px 0px",
            }}
          />
        ) : (
          <Box
            sx={{
              height: 400, // Adjust the height as needed
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid black",
              borderRadius: "30px 30px 0px 0px",
              backgroundColor: "#f0f0f0", // A light gray background
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
          </Box>
        )} */}
      <CardContent>
        <Typography
          gutterBottom
          variant="body1"
          fontFamily={CONTENT}
          //fontWeight="bold"
          component="div"
          sx={{ fontStyle: "italic" }}
        >
          {problem.story}
        </Typography>
        <Typography
          gutterBottom
          variant="body1"
          fontFamily={TITLE_THICK}
          fontSize={25}
          //fontWeight="bold"
          component="div"
          sx={{ mt: 5 }}
        >
          TASK
        </Typography>
        <Typography
          gutterBottom
          variant="body1"
          fontFamily={TITLE}
          //fontWeight="bold"
          component="div"
          sx={{ mt: 1 }}
        >
          {problem.task}
        </Typography>
        <div
          style={{
            width: "100%",
            //height: 40,
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Tooltip
            title={isSpeakingChunk ? "Speaking..." : "Listen to Problem"}
          >
            <IconButton
              sx={{
                borderRadius: "50%",
                color: isSpeakingChunk ? "red" : textColor,
                bgcolor: isSpeakingChunk ? "black" : buttonBackgroundColor,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 1.5, // Ensure no extra padding inside the button
                width: "40px", // Explicit width (adjust as needed)
                height: "40px", // Explicit height (adjust as needed)
                "&:hover": {
                  color: isSpeakingChunk ? "red" : textColorOnHover,
                  bgcolor: isSpeakingChunk
                    ? "black"
                    : buttonBackgroundColorOnHover,
                },
              }}
              onClick={() => {
                isSpeakingChunk
                  ? handleCancel()
                  : handleSpeak(problemStatement);
              }}
            >
              <FaPlay style={{ fontSize: "24px" }} />{" "}
              {/* Adjust icon size if necessary */}
            </IconButton>
          </Tooltip>

          {userDetails && (
            <CustomRoundedButton
              textColor={textColor}
              textColorOnHover={textColorOnHover}
              backgroundColor={buttonBackgroundColor}
              backgroundColorOnHover={buttonBackgroundColorOnHover}
              borderRadius={buttonBorderRadius}
              label={
                userDetails.solvedPuzzleIds.includes(problem.problemId)
                  ? "ALREADY DONE."
                  : "TRY IT !"
              }
              // disabled={userDetails.solvedPuzzleIds.includes(
              //   problem.problemId
              // )}
              handleClick={() => {
                openProblemInEditor(userID, problem.problemId);
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProblemCard;
