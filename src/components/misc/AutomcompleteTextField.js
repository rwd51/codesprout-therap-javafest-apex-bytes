import React, { useEffect } from "react";
import { Autocomplete, Chip, TextField } from "@mui/material";

function AutomcompleteTextField({
  options,
  selectedOptions,
  setSelectedOptions,
  objectProperty,
  label,
  marginTop = 0,
  borderRadius = 0,
  outlineOnFocus = "black",
  backgroundColor = "white",
  labelColorOnFocus = "black",
  dropdownBgColor = "#f0f0f0", //grey
  dropdownTextColor = "black",
  dropdownTextColorOnHover = "white",
  dropdownBgColorOnHover = "#363535", //dark grey
  chipBgColor = "#f0f0f0", //grey
  chipTextColor = "black",
  chipBorderColor = "#363535", //dark grey
  chipDeleteIconColor = "#363535", //dark grey
  chipBgColorOnHover = "#363535", //dark blue
  chipTextColorOnHover = "white",
  chipDeleteIconColorOnHover = "white",
  maxDropdownHeight = 200,
  selectedBgColor = "#cccccc", // light grey
  selectedTextColor = "black",
  selectedBgColorOnHover = "#aaaaaa",
  selectedTextColorOnHover = "white",
  clearIconColor = "black",
  clearIconBgColor = "transparent",
  clearIconColorOnHover = "white",
  clearIconBgColorOnHover = "black",
  freeSolo = true,
  disabled=false,
}) {
  const filterFromOptions = (options, objectProperty) => {
    let filteredOptions = [];
    options.forEach((option) => {
      filteredOptions.push(option[objectProperty]);
    });

    return filteredOptions;
  };

  const getOptionObjectFromProperty = (
    options,
    objectProperty,
    propertyValue
  ) => {
    let filteredOptionObjectArray = [];

    propertyValue.forEach((value) => {
      options.forEach((option) => {
        if (option[objectProperty] === value) {
          filteredOptionObjectArray.push(option);
          return;
        }
      });
    });
    return filteredOptionObjectArray;
  };

  return (
    <Autocomplete
      multiple
      options={
        objectProperty ? filterFromOptions(options, objectProperty) : options
      }
      value={
        objectProperty ? filterFromOptions(selectedOptions, objectProperty) : selectedOptions
      }
      disabled={disabled}
      sx={{
        mt: marginTop,
        "& .MuiOutlinedInput-root": {
          borderRadius: borderRadius,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: outlineOnFocus,
          },
          backgroundColor: backgroundColor,
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
          color: labelColorOnFocus,
        },
        "& .MuiAutocomplete-clearIndicator": {
          color: clearIconColor,
          backgroundColor: clearIconBgColor,
          "&:hover": {
            color: clearIconColorOnHover,
            backgroundColor: clearIconBgColorOnHover,
          },
        },
      }}
      componentsProps={{
        popper: {
          sx: {
            "& .MuiAutocomplete-listbox": {
              maxHeight: maxDropdownHeight,
              overflowY: "auto",
              bgcolor: dropdownBgColor,
              "& .MuiAutocomplete-option": {
                color: dropdownTextColor,
                "&:hover": {
                  bgcolor: dropdownBgColorOnHover,
                  color: dropdownTextColorOnHover,
                },
              },
              "& .MuiAutocomplete-option[aria-selected='true']": {
                bgcolor: selectedBgColor,
                color: selectedTextColor,
                "&:hover": {
                  bgcolor: selectedBgColorOnHover,
                  color: selectedTextColorOnHover,
                },
              },
            },
          },
        },
      }}
      onChange={(event, newValue) => {
        if (objectProperty) {
          setSelectedOptions(
            getOptionObjectFromProperty(options, objectProperty, newValue)
          );
        } else setSelectedOptions(newValue);
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip
            label={option}
            {...getTagProps({ index })}
            sx={{
              backgroundColor: chipBgColor,
              color: chipTextColor,
              border: `1px solid ${chipBorderColor}`,
              "& .MuiChip-deleteIcon": {
                color: chipDeleteIconColor,
              },
              "&:hover": {
                backgroundColor: chipBgColorOnHover,
                color: chipTextColorOnHover,
                "& .MuiChip-deleteIcon": {
                  color: chipDeleteIconColorOnHover,
                },
              },
            }}
            onDelete={() => {
              setSelectedOptions(
                selectedOptions.filter((title) =>
                  objectProperty
                    ? title[objectProperty] !== option
                    : title !== option
                )
              );
            }}
          />
        ));
      }}
      freeSolo={freeSolo}
    />
  );
}

export default AutomcompleteTextField;
