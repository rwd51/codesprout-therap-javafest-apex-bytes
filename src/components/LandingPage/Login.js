import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//MUI
import { Grid, Typography } from "@mui/material";

//components
import CustomRoundedTextField from "../misc/CustomRoundedTextField";
import CustomRoundedButton from "../misc/CustomRoundedButton";

//attribute/color values
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

//configuring env variables
import { USER_SERVICE_URI, PARENT_SERVICE_URI } from "../../env";

function Login({ setAuth, setUserType, setUserID, setIsLoading, type }) {
  //Handling inputs
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const { username, password } = inputs;
  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  ///////////

  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      setIsLoading(true);
      let res;
      if (type === "kids") {
        res = await fetch(`${USER_SERVICE_URI}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //'token': localStorage.token
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
      } else if (type === "parents") {
        res = await fetch(`${PARENT_SERVICE_URI}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //'token': localStorage.token
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
      }

      const parseRes = await res.json();

      if (res.ok) {
        console.log(parseRes);
        setAuth(true);

        localStorage.setItem("token", parseRes.token);

        if (type === "kids") {
          setUserID(parseRes.user.id);
          setUserType("kids");
          navigate(`/kids/${parseRes.user.id}`, { replace: true });
        } else if (type === "parents") {
          setUserID(parseRes.parent.id);
          setUserType("parents");
          navigate(`/parents/${parseRes.parent.id}`, { replace: true });
        }
      } else {
      }
    } catch (err) {
      console.error("Error fetching user details", err.message);
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
      }}
    >
      <Grid container spacing={1} alignItems="center" width="100%">
        <Grid item xs={12} md={12}>
          <CustomRoundedTextField
            label="Username"
            name="username"
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            colorOnFocus={colorOnFocus}
            handleInputChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <CustomRoundedTextField
            label="Password"
            name="password"
            type="password"
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            colorOnFocus={colorOnFocus}
            handleInputChange={handleInputChange}
          />
        </Grid>
      </Grid>

      <CustomRoundedButton
        textColor={textColor}
        textColorOnHover={textColorOnHover}
        backgroundColor={buttonBackgroundColor}
        backgroundColorOnHover={buttonBackgroundColorOnHover}
        borderRadius={buttonBorderRadius}
        label="Login"
        handleClick={handleLoginClick}
      />
    </div>
  );
}

export default Login;
