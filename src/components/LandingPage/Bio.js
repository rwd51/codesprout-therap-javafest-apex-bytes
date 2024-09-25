import React from "react";

//components
import CustomRoundedTextField from "../misc/CustomRoundedTextField";
import CustomRoundedButton from "../misc/CustomRoundedButton";

//color/attribute/font values
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../values/Button";

function Bio({handleNext, handleBack, bio, setBio}) {
  return (
    <div style={{ width: "50%", padding: 10 }}>
      {" "}
      <CustomRoundedTextField
        //label="About"
        defaultValue={bio}
        name="bio"
        backgroundColor={"#fcfbe1"}
        borderRadius={"30px"}
        colorOnFocus={"#334B71"}
        handleInputChange={(e) => setBio(e.target.value)}
        required={true}
      />{" "}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <CustomRoundedButton
          textColor={textColor}
          textColorOnHover={textColorOnHover}
          backgroundColor={buttonBackgroundColor}
          backgroundColorOnHover={buttonBackgroundColorOnHover}
          borderRadius={buttonBorderRadius}
          label="Back"
          handleClick={() => {handleBack()}}
        />
        <CustomRoundedButton
          textColor={textColor}
          textColorOnHover={textColorOnHover}
          backgroundColor={buttonBackgroundColor}
          backgroundColorOnHover={buttonBackgroundColorOnHover}
          borderRadius={buttonBorderRadius}
          label="Continue"
          disabled={bio===""}
          handleClick={() => {handleNext()}}
        />
      </div>
    </div>
  );
}

export default Bio;
