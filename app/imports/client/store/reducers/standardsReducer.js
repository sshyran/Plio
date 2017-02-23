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
  isDeleted: [],
  nonDeleted: [],
};

const reduceVisibleStandards = reduceC((acc, { _id, isDeleted }) => {
  if (isDeleted) return { ...acc, isDeleted: [...acc.isDeleted, _id] };

  return { ...acc, nonDeleted: [...acc.nonDeleted, _id] };
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTERED_STANDARDS:
    case SET_STANDARD_DEPS_READY:
    case SET_STANDARDS_INITIALIZING:
      return { ...state, ...action.payload };
    case SET_STANDARDS:
      return reduceVisibleStandards(state, action.payload);
    default:
      return state;
  }
}
