import { _ } from 'meteor/underscore';

import {
  SET_STANDARDS,
  ADD_STANDARD,
  UPDATE_STANDARD,
  REMOVE_STANDARD,
  SORT_STANDARDS,
} from '../../actions/types';
import { normalizeData, add, update, remove } from '../../lib/normalize';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import { sortArrayByTitlePrefix, extractIds } from '/imports/api/helpers';

const initialState = {
  entities: {},
  allIds: [],
};

const sortStandards = (state, action) => {
  let standards = state.allIds.map(id => state.entities[id]);

  if (action.payload.filter === STANDARD_FILTER_MAP.DELETED) {
    standards = _.sortBy(standards, 'deletedAt').reverse();
  } else {
    standards = sortArrayByTitlePrefix(standards);
  }

  const allIds = extractIds(standards);

  return { ...state, allIds };
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_STANDARDS:
      return normalizeData(state, action);
    case SORT_STANDARDS:
      return sortStandards(state, action);
    case ADD_STANDARD:
      return add(state, action);
    case UPDATE_STANDARD:
      return update(state, action);
    case REMOVE_STANDARD:
      return remove(state, action);
    default:
      return state;
  }
}
