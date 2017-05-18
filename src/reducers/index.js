import { combineReducers } from 'redux';

import CountReducer from './count-reducer';

const rootReducer = combineReducers({
  count: CountReducer,
  // profile: ProfileReducer,
});

export default rootReducer;
