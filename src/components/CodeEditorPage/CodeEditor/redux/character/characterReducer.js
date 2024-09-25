import {
  SET_ACTIVE_CHARACTER,
  ADD_CHARACTER,
  SET_ANGLE,
  SET_NAME,
  DELETE_CHARACTER,
  SET_X,
  SET_Y,
  SET_SCALE,
  SET_VISIBLE,
  SET_SHOW_ANGLES,
  INITIALIZE_CHARACTER_LIST,
} from "./actionTypes";

const initialState = {
  characters: [
    {
      id: "sprite0",
      angle: 0,
      type: "Tera",
      name: "sprite0",
      position: { x: 0, y: 0, prevX: null, prevY: null, run: false },
      scale: 1,
      visible: true,
      showAngles: false,
    },
  ], // Added default type
  active: {
    id: "sprite0",
    type: "Tera",
    name: "sprite0",
    angle: 0,
    position: { x: 0, y: 0, prevX: null, prevY: null, run: false },
    scale: 1,
    visible: true,
    showAngles: false,
  },
};

export const characterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_CHARACTER: {
      const index = parseInt(action.id.charAt(6));
      console.log(index);
      return {
        ...state,
        active: {
          id: action.id,
          type: action.spriteType,
          name: state.characters[index].name,
          angle: state.characters[index].angle,
          position: state.characters[index].position,
          scale: state.characters[index].scale,
          visible: state.characters[index].visible,
          showAngles: state.characters[index].showAngles,
        },
      };
    }

    case ADD_CHARACTER:
      let charactersArray = state.characters;
      charactersArray.push({
        id: `sprite${state.characters.length}`,
        angle: 0,
        type: action.spriteType, // Use the spriteType from action
        name: `sprite${state.characters.length}`,
        position: { x: 0, y: 0, prevX: null, prevY: null, run: false },
        scale: 1,
        visible: true,
        showAngles: false,
      });

      return {
        ...state,
        characters: charactersArray,
      };

    case DELETE_CHARACTER:
      const index = parseInt(action.id.charAt(6));

      const indexToBeMadeActive =
        index === state.characters.length - 1 ? index - 1 : index;

      if (indexToBeMadeActive === -1) {
        //if there remains no more characters
        return {
          ...state,
          characters: [],
          active: {},
        };
      }

      const filteredCharacterArray = state.characters.filter(
        (c) => c.id !== action.id
      );

      const remappedCharacterArray = filteredCharacterArray.map((c, index) => ({
        ...c,
        id: `sprite${index}`,
      }));

      const newActiveCharacter = remappedCharacterArray[indexToBeMadeActive];

      return {
        ...state,
        characters: remappedCharacterArray,
        active: {
          id: newActiveCharacter.id,
          type: newActiveCharacter.type,
          name: newActiveCharacter.name,
          angle: newActiveCharacter.angle,
          position: newActiveCharacter.position,
          scale: newActiveCharacter.scale,
          visible: newActiveCharacter.visible,
          showAngles: newActiveCharacter.showAngles,
        },
      };

    case SET_ANGLE: {
      let characters_Array = state.characters;
      let curr_character = characters_Array.find(
        (character) => character.id === state.active.id
      );
      const curr_character_index = characters_Array.findIndex(
        (character) => character.id === state.active.id
      );
      if (curr_character_index > -1) {
        curr_character.angle = action.angle;
        characters_Array[curr_character_index] = curr_character;
      }

      return {
        ...state,
        characters: characters_Array,
        active: {
          ...state.active,
          angle: action.angle,
        },
      };
    }
    case SET_X: {
      let characters_Array = state.characters;
      let curr_character = characters_Array.find(
        (character) => character.id === state.active.id
      );
      const curr_character_index = characters_Array.findIndex(
        (character) => character.id === state.active.id
      );
      let prevX;
      if (curr_character_index > -1) {
        prevX = curr_character.position.prevX = curr_character.position.x;
        curr_character.position.x = action.x;
        curr_character.position.run = action.run;
        characters_Array[curr_character_index] = curr_character;
      }

      return {
        ...state,
        characters: characters_Array,
        active: {
          ...state.active,
          position: {
            ...state.active.position,
            x: action.x,
            prevX: prevX,
            run: action.run,
          },
        },
      };
    }

    case SET_Y: {
      let characters_Array = state.characters;
      let curr_character = characters_Array.find(
        (character) => character.id === state.active.id
      );
      const curr_character_index = characters_Array.findIndex(
        (character) => character.id === state.active.id
      );
      let prevY;
      if (curr_character_index > -1) {
        prevY = curr_character.position.prevY = curr_character.position.y;
        curr_character.position.y = action.y;
        curr_character.position.run = action.run;
        characters_Array[curr_character_index] = curr_character;
      }

      return {
        ...state,
        characters: characters_Array,
        active: {
          ...state.active,
          position: {
            ...state.active.position,
            y: action.y,
            prevY: prevY,
            run: action.run,
          },
        },
      };
    }
    case SET_NAME: {
      const index = parseInt(action.id.charAt(6));

      let charactersArray = state.characters;
      let active = state.active;

      charactersArray[index].name = action.name;
      active.name = action.name;

      return {
        ...state,
        characters: charactersArray,
        active: active,
      };
    }

    case SET_SCALE: {
      let characters_Array = state.characters;
      let curr_character = characters_Array.find(
        (character) => character.id === state.active.id
      );
      const curr_character_index = characters_Array.findIndex(
        (character) => character.id === state.active.id
      );
      if (curr_character_index > -1) {
        curr_character.scale = action.scale;
        characters_Array[curr_character_index] = curr_character;
      }

      return {
        ...state,
        characters: characters_Array,
        active: {
          ...state.active,
          scale: action.scale,
        },
      };
    }

    case SET_VISIBLE: {
      let characters_Array = state.characters;
      let curr_character = characters_Array.find(
        (character) => character.id === state.active.id
      );
      const curr_character_index = characters_Array.findIndex(
        (character) => character.id === state.active.id
      );
      if (curr_character_index > -1) {
        curr_character.visible = action.visible;
        characters_Array[curr_character_index] = curr_character;
      }

      return {
        ...state,
        characters: characters_Array,
        active: {
          ...state.active,
          visible: action.visible,
        },
      };
    }

    case SET_SHOW_ANGLES: {
      let characters_Array = state.characters;
      let curr_character = characters_Array.find(
        (character) => character.id === state.active.id
      );
      const curr_character_index = characters_Array.findIndex(
        (character) => character.id === state.active.id
      );
      if (curr_character_index > -1) {
        curr_character.showAngles = action.showAngles;
        characters_Array[curr_character_index] = curr_character;
      }

      return {
        ...state,
        characters: characters_Array,
        active: {
          ...state.active,
          showAngles: action.showAngles,
        },
      };
    }

    case INITIALIZE_CHARACTER_LIST: {
      console.log({
        characters: action.characters,
        active: action.active,
      });
      return {
        characters: action.characters,
        active: action.active,
      };
    }

    default:
      return state;
  }
};
