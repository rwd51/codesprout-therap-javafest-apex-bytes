import {
  ADD_CHARACTER,
  DELETE_CHARACTER,
  SET_ACTIVE_CHARACTER,
  SET_ANGLE,
  SET_NAME,
  SET_X,
  SET_Y,
  SET_SCALE,
  SET_VISIBLE,
  SET_SHOW_ANGLES,
  INITIALIZE_CHARACTER_LIST
} from "./actionTypes";

export const setCharacterAngle = (characterAngle) => {
  return {
    type: SET_ANGLE,
    angle: characterAngle,
  };
};

export const setActive = (character_id, spriteType) => {
  return {
    type: SET_ACTIVE_CHARACTER,
    id: character_id,
    spriteType: spriteType,
  };
};

// Modified to accept a spriteType parameter
export const addCharacter = (spriteType) => {
  return {
    type: ADD_CHARACTER,
    spriteType: spriteType,
  };
};

export const deleteCharacter = (id) => {
  return {
    type: DELETE_CHARACTER,
    id: id,
  };
};

export const setName = (id, name) => {
  return {
    type: SET_NAME,
    id: id,
    name: name,
  };
};

export const setX = (x, run = false) => {
  return {
    type: SET_X,
    x: x,
    run: run,
  };
};

export const setY = (y, run = false) => {
  return {
    type: SET_Y,
    y: y,
    run: run,
  };
};

export const setScale = (scale) => {
  return {
    type: SET_SCALE,
    scale: scale,
  };
};

export const setVisible = (visible) => {
  return {
    type: SET_VISIBLE,
    visible: visible,
  };
};

export const setShowAngles = (showAngles) => {
  return {
    type: SET_SHOW_ANGLES,
    showAngles: showAngles,
  };
};

export const setCharacterList = (characterList, activeCharacter) => {
  return {
    type: INITIALIZE_CHARACTER_LIST,
    characters: characterList,
    active: activeCharacter
  };
};
