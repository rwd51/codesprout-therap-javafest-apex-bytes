import {
  SET_LIST,
  ADD_LIST,
  DELETE_LIST,
  INITIALIZE_ALL_LISTS,
  UPDATE_COMPONENT_VALUE,
  UPDATE_ACTIVE,
  DUMMY,
  SET_PREV_CODE,
} from "./types";

export const updateList = (id, new_list) => {
  return {
    type: SET_LIST,
    list: new_list,
    id: id,
  };
};

export const addList = (character_id) => {
  return {
    type: ADD_LIST,
    character_id: character_id,
  };
};

export const deleteList = (character_id) => {
  return {
    type: DELETE_LIST,
    character_id: character_id,
  };
};

export const initializeAllLists = (midAreaLists) => {
  return {
    type: INITIALIZE_ALL_LISTS,
    midAreaLists: midAreaLists,
  };
};

export const updateComponentValue = (
  midAreaListIndex,
  componentIndex,
  values
) => {
  return {
    type: UPDATE_COMPONENT_VALUE,
    midAreaListIndex: midAreaListIndex,
    componentIndex: componentIndex,
    values: values,
  };
};
export const updateActive = (midAreaListIndex, componentIndex, active) => {
  return {
    type: UPDATE_ACTIVE,
    midAreaListIndex: midAreaListIndex,
    componentIndex: componentIndex,
    active: active,
  };
};
export const dummy = () => {
  return {
    type: DUMMY,
  };
};

export const setPrevCode = (prevCode) => {
  return {
    type: SET_PREV_CODE,
    prevCode: prevCode,
  }
}
