import { combineReducers } from 'redux';

import {
  SET_FILTERED_STANDARDS,
  SET_STANDARD_DEPS_READY,
  SET_STANDARDS_INITIALIZING,
  SET_STANDARDS,
} from '../actions/types';
import { reduceC } from '/imports/api/helpers';

const initialState = {
  standardsFiltered: [],
  areDepsReady: false,
  initializing: true,
};

const reduceVisibleStandards = reduceC((acc, { _id, isDeleted }) => {
  if (isDeleted) return { ...acc, isDeleted: [...acc.isDeleted, _id] };

  return { ...acc, nonDeleted: [...acc.nonDeleted, _id] };
}, {});

function visibleStandards(state = {}, action) {
  switch (action.type) {
    case SET_STANDARDS:
      return reduceVisibleStandards(action.payload);
    default:
      return state;
  }
}

function standardsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTERED_STANDARDS:
    case SET_STANDARD_DEPS_READY:
    case SET_STANDARDS_INITIALIZING:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default combineReducers({
  visibleStandards,
  standards: standardsReducer,
});
