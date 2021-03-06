import { ActionTypes } from '../actions';

const defaultState = {
  all: [],
  player: {},
  doomed: 'Nobody! (what nice villagers)',
};

const PlayerReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_PLAYERS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_PLAYERS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_PLAYER:
      return Object.assign({}, state, { player: action.payload });
    case ActionTypes.VOTES_COUNTED:
      return Object.assign({}, state, { doomed: action.payload });

    default:
      return state;
  }
};

export default PlayerReducer;
