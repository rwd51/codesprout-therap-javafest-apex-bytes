import React from "react";

//MUI
import { TextField } from "@mui/material";

// function CustomRoundedTextField({
//   label,
//   name,
//   type,
//   backgroundColor,
//   borderRadius,
//   colorOnFocus,
//   handleInputChange,
//   required,
//   helperText,
//   error,
// }) {
//   //type=password or other types
//   return (
//     <TextField
//       label={label}
//       name={name}
//       type={type}
//       variant="outlined" // Change to outlined variant
//       required={required}
//       error={error}
//       helperText={helperText}
//       sx={{
//         marginBottom: 2, // Use theme spacing
//         backgroundColor: backgroundColor,
//         borderRadius: borderRadius,
//         width: "100%",
//         "& .MuiFilledInput-root": {
//           borderRadius: borderRadius,
//           position: "relative",
//           "&::after": {
//             // Style the underline when the TextField is focused
//             left: "7%",
//             right: "7%",
//             bottom: 0,
//             height: "3px",
//             backgroundColor: colorOnFocus, // Custom color for focused state underline
//           },
//           "&::before": {
//             // Style the underline in the default state
//             left: "7%",
//             right: "7%",
//             bottom: 0,
//             height: "1px",
//             backgroundColor: "transparent", // Remove the default line color
//             content: '""',
//             borderBottom: "1px solid rgba(0, 0, 0, 0.42)", // Custom color for default state underline, match with theme
//             "&:hover": {
//               borderBottom: `2px solid ${colorOnFocus}`, // Color on hover
//             },
//           },
//         },
//         "& .MuiFilledInput-input": {
//           // Adjust input text positioning
//           padding: "30px 14px 10px 14px",
//           fontSize: "1rem",
//           lineHeight: "1.5",
//           //color: colorOnFocus
//         },
//         "& .MuiInputLabel-root": {
//           // Styles for the label
//           color: "#000", // Default color, can be set to match the theme
//           "&.Mui-focused": {
//             // Style for label when the TextField is focused
//             color: colorOnFocus, // Custom color for focused state label
//           },
//         },
//       }}
//       onChange={handleInputChange}
//     />
//   );
// }
// export default CustomRoundedTextField;

//the above is the underlined version



function CustomRoundedTextField({
  label,
  name,
  type,
  backgroundColor,
  borderRadius,
  colorOnFocus,
  handleInputChange,
  onKeyDown,
  required,
  min,
  helperText,
  error,
  value,
  multiline=false,
  maxHeight,
  maxLength,
  height="auto",
  defaultValue = "",
  placeholder,
  disabled=false
}) {
  return (
    <TextField
      label={label}
      value={value}
      name={name}
      type={type}
      variant="outlined" // Change to outlined variant
      required={required}
      error={error}
      helperText={helperText}
      multiline={multiline}
      disabled={disabled}
      inputProps={{
        style: {
          maxHeight: maxHeight,
          overflowY: "auto",
        },
        maxLength: maxLength,
        min: min, // Ensure only non-negative numbers are allowed
        onInput: (e) => {
          // Prevent negative numbers if type is 'number'
          if (type === 'number' && e.target.value < min) {
            e.target.value = 0;
          }
        }
      }}
      defaultValue={defaultValue}
      sx={{
        marginBottom: 2, // Use theme spacing
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        width: "100%",
        "& .MuiOutlinedInput-root": {  // Update to use OutlinedInput class
          borderRadius: borderRadius,
          position: "relative",
          // maxHeight: maxHeight, // Set maxHeight
          // overflow: multiline ? "auto" : "visible",
          "& fieldset": { // Style the outline
            borderColor: "rgba(0, 0, 0, 0.42)", // Default outline color
            "&:hover": {
              borderColor: colorOnFocus, // Color on hover
            },
          },
          "&.Mui-focused fieldset": { // Style the outline when focused
            borderColor: colorOnFocus // Custom color for focused state outline
          },
        },
        "& .MuiOutlinedInput-input": {
          // Adjust input text positioning
          padding: "20px 14px 20px 20px",
          fontSize: "1rem",
          lineHeight: "1.5",
          height: height,
          maxHeight: maxHeight, // Make sure this is set
          overflowY: multiline ? "auto" : "visible", // Ensure this is set
          display: multiline ? "block" : "inline-flex", // This is crucial for multiline
        },
        "& .MuiInputLabel-root": {
          // Styles for the label
          color: "#000", // Default color, can be set to match the theme
          "&.Mui-focused": {
            // Style for label when the TextField is focused
            color: colorOnFocus, // Custom color for focused state label
          },
        },
      }}
      onChange={handleInputChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  );
}
export default CustomRoundedTextField;
