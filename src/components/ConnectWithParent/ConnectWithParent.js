import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//MUI
import {
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";

//components
import ParentInfoContainer from "./ParentInfoContainer";
import CustomRoundedButton from "../misc/CustomRoundedButton";
import CustomRoundedTextField from "../misc/CustomRoundedTextField";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";
import { PARENT_SERVICE_URI, USER_SERVICE_URI } from "../../env";

//utils
import _ from "lodash";

const parentUserIDs = ["1", "2", "3"];
const dummyArray = ["Option 1", "Option 2", "Option 3"];

const allParentsExceptMine = [
  {
    id: "66e322b6c8243a06add486a4",
    username: "Rawad1",
    password: "cookin",
    name: "Rawad Nashwan",
    email: "ruwad567@gmail.com",

    photo: "",
    childIds: [],
    pendingRequests: [],
  },
  {
    id: "66e322b6c8243a06add486a5",
    username: "Rawad2",
    password: "cookin",
    name: "Rawad Nashwan",
    email: "ruwad567@gmail.com",

    photo: "",
    childIds: [],
    pendingRequests: [],
  },
  {
    id: "66e322b6c8243a06add486a6",
    username: "Rawad3",
    password: "cookin",
    name: "Rawad Nashwan",
    email: "ruwad567@gmail.com",

    photo: "",
    childIds: [],
    pendingRequests: [],
  },
];

const sentRequests = [
  {
    parentId: "66dac227aca56365d22ed637",
    username: "john_doe1",
    name: "John Doe1",
    photo: "https://example.com/photos/john_doe.jpg",
  },
  {
    parentId: "66dac227aca56365d22ed637",
    username: "john_doe2",
    name: "John Doe2",
    photo: "https://example.com/photos/john_doe.jpg",
  },
  {
    parentId: "66dac227aca56365d22ed637",
    username: "john_doe3",
    name: "John Doe3",
    photo: "https://example.com/photos/john_doe.jpg",
  },
];

// const myParents = [
//   {
//     parentId: "66dac227aca56365d22ed637",
//     username: "john_doe1",
//     name: "John Doe1",
//     photo: "https://example.com/photos/john_doe.jpg",
//   },
//   {
//     parentId: "66dac227aca56365d22ed637",
//     username: "john_doe2",
//     name: "John Doe2",
//     photo: "https://example.com/photos/john_doe.jpg",
//   },
//   {
//     parentId: "66dac227aca56365d22ed637",
//     username: "john_doe3",
//     name: "John Doe3",
//     photo: "https://example.com/photos/john_doe.jpg",
//   },
// ];

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

//fetching all parents except mine
const fetchAllParentsExceptMine = async (userID) => {
  try {
    const res = await fetch(
      `${PARENT_SERVICE_URI}/${userID}/availableParents`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    const parseRes = await res.json();
    if (res.ok) {
      console.log(parseRes);
      return parseRes;
    } else {
      return;
    }
  } catch (err) {
    console.error(err.message);
  }
};

//fetching all sent requests
const fetchSentRequests = async (userID) => {
  try {
    const res = await fetch(
      `${USER_SERVICE_URI}/getSentRequests?userId=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    const parseRes = await res.json();
    if (res.ok) {
      console.log(parseRes);
      return parseRes;
    } else {
    }
  } catch (err) {
    console.log("bruh");
    console.error(err.message);
  }
};

//fetch your parents
const fetchParents = async (userID) => {
  try {
    const res = await fetch(`${PARENT_SERVICE_URI}/${userID}/getParents`, {
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

function ConnectWithParent() {
  const { userID } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [fetchDetails, setFetchDetails] = useState(false);

  //fetching user info
  useEffect(() => {
    fetchUserDetails(userID)
      .then((user) => {
        setUserDetails(user);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchAllParentsExceptMine(userID)
      .then((parentsExceptMine) => {
        setAllParents(parentsExceptMine);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchParents(userID)
      .then((myParents) => {
        console.log(myParents);
        setParents(myParents);
      })
      .catch((err) => {
        console.log(err);
      });

    fetchSentRequests(userID)
      .then((sentRequests) => {
        console.log(sentRequests);
        setSentRequestsToParents(sentRequests);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID, fetchDetails]);

  const [selectedParent, setSelectedParent] = useState(null);
  const [parentHasAccount, setParentHasAccount] = useState(true);
  const [parentEmail, setParentEmail] = useState("");

  const [allParents, setAllParents] = useState([]);
  const [parents, setParents] = useState(null);
  const [sentRequestsToParents, setSentRequestsToParents] = useState(null);

  // const handleChange = (event) => {
  //   setSelectedParent(event.target.value);
  // };

  //handling sending requests to parents
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const handleSendRequest = async (parentID) => {
    try {
      setIsSendingRequest(true);
      console.log(`${PARENT_SERVICE_URI}/${parentID}/request`);
      const res = await fetch(`${PARENT_SERVICE_URI}/${parentID}/request`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          //'token': localStorage.token
        },
        body: JSON.stringify({
          childId: userDetails.id,
          username: userDetails.username,
          name: userDetails.name,
          photo: userDetails.photo,
          topicInterests: userDetails.topicInterests,
          badges: userDetails.badges,
          tag: userDetails.tag,
          bio: userDetails.bio,
        }),
      });
      return res;
    } catch (error) {
      console.log(error);
    } finally {
      setIsSendingRequest(false);
    }
  };

  useEffect(() => {
    console.log(selectedParent);
  }, [selectedParent]);
  return (
    <Grid container>
      <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
        <img
          src={`${window.location.origin}/Parent/image-1.gif`}
          style={{ marginLeft: 80 }}
        />
      </Grid>
      <Grid item xs={6}>
        <ParentInfoContainer
          title="Parents"
          scroll_id="parent-info-container"
          height="80vh"
          parents={parents}
        />
      </Grid>
      <Grid item xs={6} sx={{ mt: 10, mb: 10 }}>
        <ParentInfoContainer
          title="Sent Requests"
          scroll_id="parent-pending-reequest-info-container"
          height="80vh"
          parents={sentRequestsToParents}
          request={true}
        />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          mt: 10,
          mb: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        <Typography fontFamily={TITLE} fontSize={40} fontWeight="bold">
          Add Parent
        </Typography>
        {/* {parentHasAccount ? (
          <FormControl sx={{ minWidth: 200, ml: 3 }}>
            <InputLabel
              id="custom-select-label"
              sx={{
                // Adjust the label position when it's focused or selected (shrunk)
                "&.MuiInputLabel-shrink": {
                  transform: "translate(17px, -17px) scale(0.75)", // Move the label slightly higher and scale
                  color: "#334B71",
                },
              }}
            >
              Select Option
            </InputLabel>
            <Select
              labelId="custom-select-label"
              value={selectedParent ? selectedParent.name : ""}
              //onChange={handleChange}
              sx={{
                borderRadius: 10, // Rounded edges
                backgroundColor: "#f0f0f0", // Custom background color
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#334B71", // Border color
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black", // Hover state border color
                },
              }}
            >
              {allParents &&
                allParents.length > 0 &&
                allParents.map((parent, index) => (
                  <MenuItem
                    key={index}
                    value={parent.username}
                    sx={{
                      // Custom dropdown background color
                      backgroundColor: _.isEqual(selectedParent, parent)
                        ? "#90D1DB !important"
                        : "#f0f0f0",
                      "&:hover": {
                        backgroundColor: _.isEqual(selectedParent, parent)
                          ? "#334B71 !important"
                          : "#363535",
                        color: "white",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#90D1DB !important", // Ensure selected item has correct color
                        "&:hover": {
                          backgroundColor: "#334B71 !important", // Ensure hover state for selected item
                        },
                      },
                    }}
                    onClick={() => {
                      setSelectedParent(parent);
                    }}
                  >
                    {parent.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        ) : (
          <div style={{ width: "70%" }}>
            <CustomRoundedTextField
              label="Parent Email"
              name="parentEmail"
              value={parentEmail}
              backgroundColor="#ffffc2"
              borderRadius="30px"
              colorOnFocus="black"
              handleInputChange={(e) => {
                setParentEmail(e.target.value);
              }}
            />
          </div>
        )} */}
        <div style={{ display: "flex", gap: "3rem" }}>
          {/* <CustomRoundedButton
            textColor={textColor}
            textColorOnHover={textColorOnHover}
            backgroundColor={buttonBackgroundColor}
            backgroundColorOnHover={buttonBackgroundColorOnHover}
            borderRadius={buttonBorderRadius}
            label={parentHasAccount ? "CAN'T FIND PARENT?" : "LOOK FOR PARENT"}
            handleClick={() => {
              setParentHasAccount(!parentHasAccount);
            }}
          /> */}
          <FormControl sx={{ minWidth: 200, ml: 3 }}>
            <InputLabel
              id="custom-select-label"
              sx={{
                // Adjust the label position when it's focused or selected (shrunk)
                "&.MuiInputLabel-shrink": {
                  transform: "translate(17px, -17px) scale(0.75)", // Move the label slightly higher and scale
                  color: "#334B71",
                },
              }}
            >
              Select Option
            </InputLabel>
            <Select
              labelId="custom-select-label"
              value={selectedParent ? selectedParent.name : ""}
              //onChange={handleChange}
              sx={{
                borderRadius: 10, // Rounded edges
                backgroundColor: "#f0f0f0", // Custom background color
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#334B71", // Border color
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black", // Hover state border color
                },
              }}
            >
              {allParents &&
                allParents.length > 0 &&
                allParents.map((parent, index) => (
                  <MenuItem
                    key={index}
                    value={parent.username}
                    sx={{
                      // Custom dropdown background color
                      backgroundColor: _.isEqual(selectedParent, parent)
                        ? "#90D1DB !important"
                        : "#f0f0f0",
                      "&:hover": {
                        backgroundColor: _.isEqual(selectedParent, parent)
                          ? "#334B71 !important"
                          : "#363535",
                        color: "white",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#90D1DB !important", // Ensure selected item has correct color
                        "&:hover": {
                          backgroundColor: "#334B71 !important", // Ensure hover state for selected item
                        },
                      },
                    }}
                    onClick={() => {
                      setSelectedParent(parent);
                    }}
                  >
                    {parent.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <CustomRoundedButton
            textColor={textColor}
            textColorOnHover={textColorOnHover}
            backgroundColor={isSendingRequest ? "black" : buttonBackgroundColor}
            backgroundColorOnHover={buttonBackgroundColorOnHover}
            borderRadius={buttonBorderRadius}
            label={
              <div style={{ minWidth: 150 }}>
                {isSendingRequest ? (
                  <CircularProgress
                    size={20}
                    thickness={40} // Thicker arc (default is 3.6)
                    style={{ color: "white" }}
                  />
                ) : (
                  "SEND REQUEST"
                )}
              </div>
            }
            disabled={isSendingRequest || !selectedParent}
            handleClick={() => {
              if (selectedParent) {
                handleSendRequest(selectedParent.id)
                  .then((res) => {
                    setFetchDetails(!fetchDetails);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
}

export default ConnectWithParent;
