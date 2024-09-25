import React, { useEffect, useState } from "react";

//MUI
import {
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Modal,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

//MUI icons
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//react-icons
import { TbAxisX, TbAxisY, TbAngle } from "react-icons/tb";
import { GiResize } from "react-icons/gi";

//redux
import { connect } from "react-redux";
import {
  addCharacter,
  deleteCharacter,
  setActive,
  setName,
  setCharacterAngle,
  setX,
  setY,
  setScale,
  setVisible,
  setShowAngles,
} from "../redux/character/actions";
import { addList, deleteList } from "../redux/midarea/actions";
import {
  setShowAxes,
  setShowCoordinates,
  setShowProjections,
} from "../redux/previewarea/actions";

//imporing lodash
import _ from "lodash";

//values
import { TITLE, CONTENT, TITLE_THICK } from "../../../../values/Fonts";
import {
  textColorOnHover,
  textColor,
  buttonBackgroundColor,
  buttonBackgroundColorOnHover,
  buttonBorderRadius,
} from "../../../../values/Button";

//components
import CustomRoundedButton from "../../../misc/CustomRoundedButton";
import CustomRoundedTextField from "../../../misc/CustomRoundedTextField";
import DrawingBoard from "./DrawingBoard/DrawingBoard";
import SpriteCard from "./sprites/SpriteCard";
import Loading from "../../../misc/Loading";
import ScrollDownButton from "../../../misc/ScrollDownButton";

//firebase
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

function SpriteManager({
  add_character,
  delete_character,
  set_active,
  set_name,
  set_x,
  set_y,
  set_character_angle,
  set_scale,
  set_visible,
  set_show_axes,
  set_show_coordinates,
  set_show_projections,
  set_show_angles,
  add_list,
  delete_list,
  character,
  previewArea,
}) {
  const [sprites, setSprites] = useState([]);
  const [selectedSprite, setSelectedSprite] = useState(null);
  const [dummySelectedSprite, setDummySelectedSprite] = useState(null);

  useEffect(() => {
    const currentSprites = character.characters?.map((c) => ({
      id: c.id,
      type: c.type,
      name: c.name,
      angle: c.angle,
      position: c.position,
      scale: c.scale,
      visible: c.visible,
      showAngles: c.showAngles,
      imgSrc: String(c.type).startsWith("autodraw")
        ? `autodraw/${c.type}.svg`
        : `svg/${c.type}.svg`,
    })) || [];
    

    const currentActiveSprite = {
      id: character.active?.id || '',
      type: character.active?.type || '',
      name: character.active?.name || '',
      angle: character.active?.angle || 0,
      position: character.active?.position || { x: 0, y: 0 },
      scale: character.active?.scale || 1,
      visible: character.active?.visible || false,
      showAngles: character.active?.showAngles || false,
      imgSrc: character.active?.type
        ? String(character.active.type).startsWith("autodraw")
          ? `autodraw/${character.active.type}.svg`
          : `svg/${character.active.type}.svg`
        : '',
    };
    

    if (currentSprites.length === 0) {
      setSprites([]);
      setSelectedSprite({});
      setDummySelectedSprite({});
    } else {
      setSprites(currentSprites);
      setSelectedSprite(currentActiveSprite);
      setDummySelectedSprite(currentActiveSprite);
    }
  }, [character]);

  const [allSprites, setAllSprites] = useState([]);
  const [filteredAllSprites, setFilteredAllSprites] = useState([]);
  const [filteredSpriteName, setFilteredSpriteName] = useState("");
  useEffect(() => {
    const storage = getStorage();
    const listRef = ref(storage, "sprites/svg/");

    listAll(listRef)
      .then((res) => {
        const spritePromises = res.items.map((itemRef) => {
          return getDownloadURL(itemRef).then((url) => {
            const name = itemRef.name.replace(".svg", ""); // Get the name without the '.svg' extension
            return { name, imgSrc: `svg/${name}.svg` };
          });
        });

        Promise.all(spritePromises).then((sprites) => {
          setAllSprites(sprites);
          setFilteredAllSprites(sprites);
        });
      })
      .catch((error) => {
        console.error("Error fetching sprites from Firebase:", error);
      });
  }, []);

  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleDelete = (sprite) => {
    delete_list(sprite.id);
    delete_character(sprite.id);
  };

  const [showAxes, setShowAxes] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showProjections, setShowProjections] = useState(false);

  const handleAddSprite = (e) => {
    add_character(selectedSprite.name);
    add_list(`sprite${character.characters.length - 1}`);

    handleClose();
  };

  const handleSetActive = (id, type) => {
    set_active(id, type); // Dispatch Redux action to set active globally
  };

  const handleEnterPressForSpriteNameChange = (event) => {
    if (event.key === "Enter") {
      setDummySelectedSprite(selectedSprite);

      set_name(selectedSprite.id, event.target.value);
    }
  };

  const handleEnterPressForSpriteAngleChange = (event) => {
    if (event.key === "Enter") {
      setDummySelectedSprite(selectedSprite);

      const angle = parseInt(event.target.value) + selectedSprite.angle;

      let anti_angle = -1 * angle;
      const el = document.getElementById(character.active.id);
      const el_axes = document.getElementById(`${character.active.id}-axes`);
      const character_angle = selectedSprite.angle;

      el.style.transition = "transform 1.5s ease-out";
      if (el_axes) el_axes.style.transition = "transform 1.5s ease-out";
      el.style.transform = `rotate(${character_angle + anti_angle}deg)`;
      if (el_axes)
        el_axes.style.transform = `translate(-50%, -50%) rotate(${
          character_angle + anti_angle
        }deg)`;

      set_character_angle(character_angle + anti_angle);
    }
  };

  const handleEnterPressForXChange = (event) => {
    if (event.key === "Enter") {
      setDummySelectedSprite(selectedSprite);

      const el = document.getElementById(`${character.active.id}-div`);

      var left = el.offsetLeft;
      const steps = parseInt(event.target.value) - selectedSprite.position.x;
      el.style.position = "relative";
      el.style.transition = "none";
      el.style.left = left + steps + "px";

      set_x(parseInt(event.target.value));
    }
  };

  const handleEnterPressForYChange = (event) => {
    if (event.key === "Enter") {
      setDummySelectedSprite(selectedSprite);

      const el = document.getElementById(`${character.active.id}-div`);

      var top = el.offsetTop;
      const steps = parseInt(event.target.value) - selectedSprite.position.y;
      el.style.position = "relative";
      el.style.transition = "none";
      el.style.top = top - steps + "px";

      set_y(parseInt(event.target.value));
    }
  };

  const handleEnterPressForScaleChange = (event) => {
    if (event.key === "Enter") {
      setDummySelectedSprite(selectedSprite);

      const scale = parseInt(event.target.value);
      const el = document.getElementById(character.active.id);
      el.style.transform = `scale(${scale}) rotate(${selectedSprite.angle}deg)`;

      set_scale(scale);
    }
  };

  const handleClickForSpriteVisibilityChange = (event) => {
    setDummySelectedSprite({
      ...dummySelectedSprite,
      visible: !selectedSprite.visible,
    });

    const el = document.getElementById(`${character.active.id}-div`);

    if (selectedSprite.visible) el.style.opacity = 0;
    else el.style.opacity = 1;
    set_visible(!selectedSprite.visible);
  };

  const handleSpriteNameChange = (event) => {
    setDummySelectedSprite({
      ...dummySelectedSprite,
      name: event.target.value,
    });
  };

  const handleSpriteAngleChange = (event) => {
    setDummySelectedSprite({
      ...dummySelectedSprite,
      angle: parseInt(event.target.value),
    });
  };

  const handleSpriteXChange = (event) => {
    setDummySelectedSprite({
      ...dummySelectedSprite,
      position: {
        ...dummySelectedSprite.position,
        x: parseInt(event.target.value),
      },
    });
  };

  const handleSpriteYChange = (event) => {
    setDummySelectedSprite({
      ...dummySelectedSprite,
      position: {
        ...dummySelectedSprite.position,
        y: parseInt(event.target.value),
      },
    });
  };

  const handleSpriteScaleChange = (event) => {
    setDummySelectedSprite({
      ...dummySelectedSprite,
      scale: parseInt(event.target.value),
    });
  };

  return (
    <Card>
      <CardContent
        id="sprite-manager-container"
        style={{
          overflowY: "auto",
          height: "100%",
          backgroundColor: "#f7f7eb",
        }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: "0.875rem", fontFamily: TITLE }}
          >
            Sprite Properties
          </Typography>
        </Grid>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Sprite"
              value={dummySelectedSprite ? dummySelectedSprite.name : ""}
              fullWidth
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: "0.75rem",
                  color: "gray",
                  "&.Mui-focused": {
                    color: "black",
                  },
                  // "&:hover": {
                  //   color: "black",
                  // },
                },
              }}
              InputProps={{
                sx: {
                  height: "25px",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  padding: "0 8px",
                  backgroundColor: "#f7f7d7",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "default",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#83e66a",
                  },
                  "&:hover": {
                    backgroundColor: "#f5f5bc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                },
              }}
              onBlur={() => setDummySelectedSprite(selectedSprite)}
              onChange={handleSpriteNameChange}
              onKeyPress={handleEnterPressForSpriteNameChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <IconButton
              onClick={handleClickForSpriteVisibilityChange}
              sx={{ "&:hover": { color: "white", backgroundColor: "#334B71" } }}
            >
              {selectedSprite && selectedSprite.visible ? (
                <VisibilityIcon />
              ) : (
                <VisibilityOffIcon />
              )}
            </IconButton>
          </Grid>
          <Grid item xs={12} md={1}>
            <Box display="flex" alignItems="center" gap="0.5rem">
              <TbAxisX style={{ fontSize: "2rem" }} />
              <Typography sx={{ fontSize: "0.875rem", fontFamily: CONTENT }}>
                X
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              type="number"
              value={
                dummySelectedSprite && !_.isEqual(dummySelectedSprite, {})
                  ? dummySelectedSprite.position.x
                  : ""
              }
              fullWidth
              InputProps={{
                sx: {
                  height: "25px",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  //padding: "0 8px",
                  backgroundColor: "#f7f7d7",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "default",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#83e66a",
                  },
                  "&:hover": {
                    backgroundColor: "#f5f5bc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                },
              }}
              onBlur={() => setDummySelectedSprite(selectedSprite)}
              onChange={handleSpriteXChange}
              onKeyPress={handleEnterPressForXChange}
            />
          </Grid>
          <Grid item xs={12} md={1} />
          <Grid item xs={12} md={1}>
            <Box display="flex" alignItems="center" gap="0.5rem">
              <TbAxisY style={{ fontSize: "2rem" }} />
              <Typography sx={{ fontSize: "0.875rem", fontFamily: CONTENT }}>
                Y
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              type="number"
              value={
                dummySelectedSprite && !_.isEqual(dummySelectedSprite, {})
                  ? dummySelectedSprite.position.y
                  : ""
              }
              fullWidth
              InputProps={{
                sx: {
                  height: "25px",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  //padding: "0 8px",
                  backgroundColor: "#f7f7d7",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "default",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#83e66a",
                  },
                  "&:hover": {
                    backgroundColor: "#f5f5bc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                },
              }}
              onBlur={() => setDummySelectedSprite(selectedSprite)}
              onChange={handleSpriteYChange}
              onKeyPress={handleEnterPressForYChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Box display="flex" alignItems="center" gap="0.5rem">
              <GiResize style={{ fontSize: "1.5rem" }} />
              <Typography sx={{ fontSize: "0.875rem", fontFamily: CONTENT }}>
                Size
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              type="number"
              value={dummySelectedSprite ? dummySelectedSprite.scale : ""}
              fullWidth
              InputProps={{
                sx: {
                  height: "25px",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  //padding: "0 8px",
                  backgroundColor: "#f7f7d7",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "default",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#83e66a",
                  },
                  "&:hover": {
                    backgroundColor: "#f5f5bc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                },
              }}
              onBlur={() => setDummySelectedSprite(selectedSprite)}
              onChange={handleSpriteScaleChange}
              onKeyPress={handleEnterPressForScaleChange}
            />
          </Grid>
          <Grid item xs={12} md={1} />
          <Grid item xs={12} md={3}>
            <Box display="flex" alignItems="center" gap="0.5rem">
              <TbAngle style={{ fontSize: "1.5rem" }} />
              <Typography sx={{ fontSize: "0.875rem", fontFamily: CONTENT }}>
                Direction
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              type="number"
              value={dummySelectedSprite ? dummySelectedSprite.angle : ""}
              fullWidth
              InputProps={{
                sx: {
                  height: "25px",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  //padding: "0 8px",
                  backgroundColor: "#f7f7d7",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "default",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#83e66a",
                  },
                  "&:hover": {
                    backgroundColor: "#f5f5bc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                },
              }}
              onBlur={() => setDummySelectedSprite(selectedSprite)}
              onChange={handleSpriteAngleChange}
              onKeyPress={handleEnterPressForSpriteAngleChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAxes}
                  onChange={(e) => {
                    setShowAxes(e.target.checked);
                    set_show_axes(e.target.checked);
                    if (!e.target.checked) {
                      setShowProjections(false);
                      set_show_projections(false);
                    }
                  }}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 18,
                      color: "#496fab",
                    },
                    "&:hover .MuiSvgIcon-root": {
                      color: "white",
                      backgroundColor: "#334B71",
                    },
                  }}
                />
              }
              label="Axes"
              sx={{
                fontSize: "0.75rem",
                "& .MuiTypography-root": {
                  fontSize: "0.75rem",
                  fontFamily: CONTENT,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showCoordinates}
                  onChange={(e) => {
                    setShowCoordinates(e.target.checked);
                    set_show_coordinates(e.target.checked);
                  }}
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 18, color: "#496fab" },
                    "&:hover .MuiSvgIcon-root": {
                      color: "white",
                      backgroundColor: "#334B71",
                    },
                  }}
                />
              }
              label="Coordinates"
              sx={{
                fontSize: "0.75rem",
                "& .MuiTypography-root": {
                  fontSize: "0.75rem",
                  fontFamily: CONTENT,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showProjections}
                  disabled={!showAxes}
                  onChange={(e) => {
                    setShowProjections(e.target.checked);
                    set_show_projections(e.target.checked);
                  }}
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 18, color: "#496fab" },
                    "&:hover .MuiSvgIcon-root": {
                      color: "white",
                      backgroundColor: "#334B71",
                    },
                  }}
                />
              }
              label="Projections"
              sx={{
                fontSize: "0.75rem",
                "& .MuiTypography-root": {
                  fontSize: "0.75rem",
                  fontFamily: CONTENT,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedSprite && selectedSprite.showAngles}
                  onChange={(e) => {
                    set_show_angles(!selectedSprite.showAngles);
                  }}
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 18, color: "#496fab" },
                    "&:hover .MuiSvgIcon-root": {
                      color: "white",
                      backgroundColor: "#334B71",
                    },
                  }}
                />
              }
              label="Angles"
              sx={{
                fontSize: "0.75rem",
                "& .MuiTypography-root": {
                  fontSize: "0.75rem",
                  fontFamily: CONTENT,
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            fontWeight="bold"
            marginTop="10px"
            sx={{ fontSize: "0.875rem", fontFamily: TITLE }}
          >
            Current Sprites
          </Typography>
        </Grid>
        <Grid
          container
          xs={12}
          spacing={2}
          sx={{
            marginTop: "10px",
            border: "2px solid black",
            maxHeight: "250px",
            overflowY: "auto",
            paddingBottom: "30px",
            paddingRight: "20px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            marginLeft: "0px",
            backgroundColor: "#f5f5bc",
            "&:hover": {
              backgroundColor: "#e8fae3", // Background color on hover
            },
          }}
        >
          {sprites.map((sprite) => (
            <Grid item key={sprite.name}>
              <SpriteCard
                sprite={sprite}
                cardWidth={60}
                cardHeight={80}
                selectionArray={false}
                selectedSprite={selectedSprite}
                setSelectedSprite={setSelectedSprite}
                setDummySelectedSprite={setDummySelectedSprite}
                handleSetActive={handleSetActive}
                handleDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="flex-end">
          <Tooltip title="Add Sprite">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{
                marginTop: "10px",
                borderRadius: "50%",
                width: "50px", // Ensure the button is circular by setting equal width and height
                height: "50px", // Ensure the button is circular by setting equal width and height
                minWidth: "50px",
                minHeight: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0, // Remove padding
                color: "#334B71",
                backgroundColor: "#93db81",
                "&:hover": {
                  backgroundColor: "#334B71", // Change background color on hover
                  color: "white", // Change icon color on hover
                },
              }}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </Box>
      </CardContent>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90vw", // Set the width to 90% of the viewport width
            height: "90vh", // Set the height to 90% of the viewport height
            bgcolor: "#d4d2d2",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
            //overflow: "auto", // Add overflow to handle content that exceeds the box
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                color: "#334B71",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#334B71",
                },
              },
              "& .Mui-selected": {
                color: "#334B71",
                backgroundColor: "#f0f0f0",
                "&:hover": {
                  color: "#000",
                  backgroundColor: "#b0aeae",
                },
              },
              "& .MuiTab-root:not(.Mui-selected)": {
                color: "#000",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#5e5e5e",
                },
              },
            }}
          >
            <Tab label="Add Sprite" />
            <Tab label="Draw Sprite" />
          </Tabs>

          {tabIndex === 0 && (
            <Box sx={{ mt: 2 }}>
              <div style={{ position: "relative" }}>
                <Grid
                  id="all-sprites-container"
                  container
                  spacing={2}
                  sx={{
                    marginTop: "10px",
                    border: "2px solid black",
                    backgroundColor: "#f0f0f0", // Default background color
                    height: "500px",
                    overflowY: "auto",
                    paddingBottom: "30px",
                    paddingRight: "20px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "#f7f7eb", // Background color on hover
                    },
                  }}
                >
                  {allSprites.length > 0 ? (
                    filteredAllSprites.map((sprite) => (
                      <Grid item key={sprite.name}>
                        <SpriteCard
                          sprite={sprite}
                          cardWidth={150}
                          cardHeight={200}
                          selectionArray={true}
                          selectedSprite={selectedSprite}
                          setSelectedSprite={setSelectedSprite}
                          // setDummySelectedSprite={setDummySelectedSprite}
                          // handleSetActive={handleSetActive}
                          // handleDelete={handleDelete}
                        />
                      </Grid>
                    ))
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Loading
                        spinnerLogoURL={`${window.location.origin}/logo/CodeSprout_Icon_Transparent.png`}
                        sprinnerWidth={`300px`}
                        spinnerHeight={`300px`}
                        spinnerImageWidth={`250px`}
                        spinnerImageHeight={`250px`}
                        spinnerColor="#334B71"
                        spinnerBackgroundColor="#ebfdff"
                      />
                    </div>
                  )}
                </Grid>
                {allSprites.length > 0 && (
                  <ScrollDownButton
                    id="all-sprites-container"
                    iconColor="#334B71"
                    iconBackgroundColor="#93db81"
                    iconColorOnHover="white"
                    iconBackgroundColorOnHover="#334B71"
                    tooltipLabel="Scroll Down"
                    //left="50%"
                  />
                )}
              </div>
              <Box
                display="flex"
                justifyContent="space-between"
                sx={{ ml: -2 }}
              >
                <div style={{ paddingTop: 10, width: "500px" }}>
                  <CustomRoundedTextField
                    placeholder="Search"
                    disabled={allSprites.length === 0}
                    value={filteredSpriteName}
                    backgroundColor="white"
                    borderRadius="30px"
                    colorOnFocus="black"
                    handleInputChange={(e) => {
                      setFilteredSpriteName(e.target.value);
                      setFilteredAllSprites(
                        allSprites.filter((sprite) =>
                          String(sprite.name)
                            .toLowerCase()
                            .includes(String(e.target.value).toLowerCase())
                        )
                      );
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <CustomRoundedButton
                    textColor={textColor}
                    textColorOnHover={textColorOnHover}
                    backgroundColor={buttonBackgroundColor}
                    backgroundColorOnHover={buttonBackgroundColorOnHover}
                    borderRadius={buttonBorderRadius}
                    label="ADD"
                    handleClick={handleAddSprite}
                  />
                </div>
              </Box>
            </Box>
          )}
          {tabIndex === 1 && (
            <Box
              sx={{
                mt: 2,
                border: "2px solid black",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <DrawingBoard handleClose={handleClose} />
              </div>
            </Box>
          )}
        </Box>
      </Modal>
    </Card>
  );
}

// mapping state to props
const mapStateToProps = (state) => {
  return {
    character: state.character,
    previewArea: state.previewArea,
  };
};

// mapping functions to components
const mapDispatchToProps = (dispatch) => {
  return {
    add_character: (spriteType) => dispatch(addCharacter(spriteType)),
    delete_character: (id) => dispatch(deleteCharacter(id)),
    set_active: (ch_id, type) => dispatch(setActive(ch_id, type)),
    set_name: (ch_id, name) => dispatch(setName(ch_id, name)),
    set_character_angle: (ch_angle) => dispatch(setCharacterAngle(ch_angle)),
    set_x: (x) => dispatch(setX(x)),
    set_y: (y) => dispatch(setY(y)),
    set_scale: (scale) => dispatch(setScale(scale)),
    set_visible: (visible) => dispatch(setVisible(visible)),
    set_show_axes: (visible) => dispatch(setShowAxes(visible)),
    set_show_projections: (visible) => dispatch(setShowProjections(visible)),
    set_show_coordinates: (visible) => dispatch(setShowCoordinates(visible)),
    set_show_angles: (visible) => dispatch(setShowAngles(visible)),
    add_list: (character_id) => dispatch(addList(character_id)),
    delete_list: (character_id) => dispatch(deleteList(character_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpriteManager);
