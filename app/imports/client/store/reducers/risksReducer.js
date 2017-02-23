import {
  SET_FILTERED_RISKS,
  SET_RISK_DEPS_READY,
  SET_RISKS_INITIALIZING,
} from '../actions/types';

const initialState = {
  risksFiltered: [],
  areDepsReady: false,
  initializing: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTERED_RISKS:
    case SET_RISK_DEPS_READY:
    case SET_RISKS_INITIALIZING:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
