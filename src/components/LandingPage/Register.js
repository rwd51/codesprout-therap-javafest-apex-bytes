import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//MUI
import { Grid, Typography } from "@mui/material";

//components
import CustomRoundedTextField from "../misc/CustomRoundedTextField";
import CustomRoundedButton from "../misc/CustomRoundedButton";

//color/attribute/font values
import {
  colorOnFocus,
  borderRadius,
  backgroundColor,
} from "../../values/TextField";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";

//env values
import { PARENT_SERVICE_URI, USER_SERVICE_URI } from "../../env";
import { setISODay } from "date-fns";

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function Register({ setAuth, setUserType, setUserID, setIsLoading, type }) {
  ///Handling the inputs together. May be handled separately too
  /////////////
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    age: "12",
    password: "",
    confirmPassword: "",
  });
  const { name, username, email, age, password, confirmPassword } = inputs;
  const handleInputChange = (e) => {
    //you may put a bracket around e. Can be renamed to anything else too
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  ///////////

  const navigate = useNavigate();

  function generateRandomNumber() {
    return Math.floor(Math.random() * 11) + 1;
  }

  const handleRegisterClick = async () => {
    if (
      name === "" ||
      username === "" ||
      email === "" ||
      age === "" ||
      password === ""
    ) {
      setShowMessage(true);
      setMessage("No fields can be empty");
      return;
    } else if (parseInt(age) <= 0) {
      setShowMessage(true);
      console.log(isValidEmail(email));
      setMessage("Please enter a valid age number");
      return;
    } else if (!isValidEmail(email)) {
      setShowMessage(true);
      setMessage("Please enter a valid email address");
      return;
    } else if (password.length < 6) {
      setShowMessage(true);
      setMessage("Passwords must have at least 6 characters");
      return;
    } else if (password !== confirmPassword) {
      setShowMessage(true);
      setMessage("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);

      let res;

      if (type === "kids") {
        res = await fetch(`${USER_SERVICE_URI}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //'token': localStorage.token
          },
          body: JSON.stringify({
            username: username,
            password: password,
            name: name,
            email: email,
            photo: "",
            bio: "",
            parentIds: [],
            sentRequests: [],
            age: parseInt(age),
            projectIds: [],
            clonedProjectIds: [],
            solvedPuzzleIds: [],
            topicInterests: [],
            badges: [],
            tag: "Rookie",
          }),
        });
      } else if (type === "parents") {
        res = await fetch(`${PARENT_SERVICE_URI}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //'token': localStorage.token
          },
          body: JSON.stringify({
            username: username,
            password: password,
            name: name,
            email: email,
            photo: `avatar_${generateRandomNumber()}`,
            childIds: [],
            pendingRequests: [],
          }),
        });
      }

      const parseRes = await res.json();

      if (res.ok) {
        console.log(parseRes);

        localStorage.setItem("token", parseRes.token);
        
        if (type === "kids") {
          setUserID(parseRes.user.id);
          setUserType("kids");
          navigate(`/getStarted/register/${parseRes.user.id}`, { replace: true });
        } else if (type === "parents") {
          setUserID(parseRes.parent.id);
          setUserType("parents");
          setAuth(true);
          navigate(`/parents/${parseRes.parent.id}`, { replace: true });
        }
      } else {
      }
    } catch (err) {
      console.error("Error registering: ", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={1} alignItems="center" width="80%">
        <Grid item xs={12} md={6}>
          <CustomRoundedTextField
            label="Name"
            name="name"
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            colorOnFocus={colorOnFocus}
            handleInputChange={handleInputChange}
            required={true}
            // helperText={}
            // error={}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomRoundedTextField
            label="Username"
            name="username"
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            colorOnFocus={colorOnFocus}
            handleInputChange={handleInputChange}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={type === "kids" ? 8 : 12}>
          <CustomRoundedTextField
            label="Email"
            name="email"
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            colorOnFocus={colorOnFocus}
            handleInputChange={handleInputChange}
            required={true}
          />
        </Grid>
        {type === "kids" && (
          <Grid item xs={12} md={4}>
            <CustomRoundedTextField
              label="Age"
              name="age"
              type="number"
              backgroundColor={backgroundColor}
              borderRadius={borderRadius}
              colorOnFocus={colorOnFocus}
              handleInputChange={handleInputChange}
              required={true}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <CustomRoundedTextField
            label="Password"
            name="password"
            type="password"
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            colorOnFocus={colorOnFocus}
            handleInputChange={handleInputChange}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomRoundedTextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            colorOnFocus={colorOnFocus}
            handleInputChange={handleInputChange}
            required={true}
          />
        </Grid>
        {showMessage && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Typography sx={{ color: "red", fontFamily: CONTENT }}>
              {message}
            </Typography>
          </div>
        )}
      </Grid>

      <CustomRoundedButton
        textColor={textColor}
        textColorOnHover={textColorOnHover}
        backgroundColor={buttonBackgroundColor}
        backgroundColorOnHover={buttonBackgroundColorOnHover}
        borderRadius={buttonBorderRadius}
        label="Register"
        handleClick={handleRegisterClick}
      />
    </div>
  );
}

export default Register;
