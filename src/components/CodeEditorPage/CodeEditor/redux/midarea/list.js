import {
  ADD_LIST,
  DELETE_LIST,
  SET_LIST,
  INITIALIZE_ALL_LISTS,
  UPDATE_COMPONENT_VALUE,
  UPDATE_ACTIVE,
  DUMMY,
  SET_PREV_CODE,
} from "./types";

const initialState = {
  midAreaLists: [
    {
      id: "midAreaList-0",
      comps: [
        {
          id: "MOVE",
          values: [0],
          active: true,
        },
      ],
      character_id: "sprite0",
    },
  ],
  lastUpdated: null,
  rendered: false,
  prevCode: null,
};

export const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIST: {
      console.log(action.id, action.list);

      let index = state.midAreaLists.findIndex((x) => x.id === action.id);
      let all_lists = state.midAreaLists;
      let [item] = all_lists.splice(index, 1);
      item.comps = action.list.comps;
      all_lists.splice(index, 0, item);

      return {
        ...state,
        midAreaLists: all_lists,
        lastUpdated: new Date().getTime(),
        rendered: false,
      };
    }
    case ADD_LIST:
      return {
        ...state, // Always spread the existing state to maintain integrity
        midAreaLists: [
          ...state.midAreaLists,
          {
            id: `midAreaList-${state.midAreaLists.length}`,
            comps: [{ id: "MOVE", values: [0], active: true }],
            character_id: action.character_id, // Set character_id correctly
          },
        ],
        lastUpdated: new Date().getTime(),
      };

    case DELETE_LIST:
      const filteredLists = state.midAreaLists.filter(
        (list) => list.character_id !== action.character_id
      );

      if (filteredLists.length === 0) {
        return {
          ...state,
          midAreaLists: [],
          lastUpdated: new Date().getTime(),
        };
      }

      // Remap the IDs based on the current indices
      const remappedLists = filteredLists.map((list, index) => ({
        ...list,
        id: `midAreaList-${index}`,
        character_id: `sprite${index}`,
      }));

      return {
        ...state,
        midAreaLists: remappedLists,
        lastUpdated: new Date().getTime(),
      };

    case INITIALIZE_ALL_LISTS:
      return {
        ...state,
        midAreaLists: action.midAreaLists,
        lastUpdated: new Date().getTime(),
        rendered: false,
      };

    case UPDATE_COMPONENT_VALUE: {
      let all_lists = state.midAreaLists;

      if (Number.isInteger(action.componentIndex)) {
        all_lists[action.midAreaListIndex].comps[action.componentIndex].values =
          action.values;
      } else {
        //array

        let currentList = all_lists[action.midAreaListIndex].comps;
        let comp;
        for (let i = 0; i < action.componentIndex.length - 1; i++) {
          comp = currentList[action.componentIndex[i]].values[1];
        }
        comp[action.componentIndex[action.componentIndex.length - 1]].values =
          action.values;
      }

      return {
        ...state,
        midAreaLists: all_lists,
        lastUpdated: new Date().getTime(),
      };
    }

    case UPDATE_ACTIVE: {
      let all_lists = state.midAreaLists;

      if (Number.isInteger(action.componentIndex)) {
        all_lists[action.midAreaListIndex].comps[action.componentIndex].active =
          action.active;
      } else {
        //array
        let currentList = all_lists[action.midAreaListIndex].comps;
        let comp;
        for (let i = 0; i < action.componentIndex.length - 1; i++) {
          comp = currentList[action.componentIndex[i]].values[1];
        }
        comp[action.componentIndex[action.componentIndex.length - 1]].active =
          action.active;
      }

      return {
        ...state,
        midAreaLists: all_lists,
        lastUpdated: new Date().getTime(),
      };
    }

    case DUMMY: {
      if (state.lastUpdated === null) {
        const old_list = state.midAreaLists;
        return {
          ...state,
          midAreaLists: old_list,
          lastUpdated: new Date().getTime(),
          rendered: true,
        };
      }
    }

    case SET_PREV_CODE: {
      return {
        ...state,
        prevCode: action.prevCode,
      };
    }

    default:
      return state;
  }
};
