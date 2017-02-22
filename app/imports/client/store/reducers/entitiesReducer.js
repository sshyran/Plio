import { normalize } from 'normalizr';
import merge from 'lodash.merge';
import set from 'lodash.set';
import * as schemas from '../lib/schema';

import { assoc, omitC } from '/imports/api/helpers';

import {
  SET_DEPARTMENTS,
  SET_FILES,
  SET_NCS,
  SET_RISKS,
  SET_ACTIONS,
  SET_WORK_ITEMS,
  SET_STANDARD_BOOK_SECTIONS,
  SET_STANDARD_TYPES,
  SET_LESSONS_LEARNED,
  SET_ORGANIZATIONS,
  SET_STANDARDS,
  SET_HELP_DOCS,
  SET_HELP_SECTIONS,
  SET_USERS,
  SET_MESSAGES,
  ADD_STANDARD,
  UPDATE_STANDARD,
  REMOVE_STANDARD,
} from '../actions/types';

const normalizer = (state, action) => {
  const key = Object.keys(action.payload)[0];
  const schema = schemas[key.substring(0, key.length - 1)];
  const entitiesSchema = { [key]: [schema] };
  const normalizedData = normalize(action.payload, entitiesSchema);
  return merge({}, state, normalizedData);
};

const add = (state, path, action) =>
  assoc(`entities.${path}.${action.payload._id}`, action.payload);
const update = (state, path, action) =>
  set({ ...state }, `entities.${path}.${action.payload._id}`, action.payload);
const remove = (state, path, action) => ({
  ...state,
  entities: {
    ...state.entities,
    [path]: omitC(action.payload, state.entities[path]),
  },
});

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_MESSAGES:
    case SET_DEPARTMENTS:
    case SET_FILES:
    case SET_NCS:
    case SET_RISKS:
    case SET_ACTIONS:
    case SET_WORK_ITEMS:
    case SET_STANDARD_BOOK_SECTIONS:
    case SET_STANDARD_TYPES:
    case SET_LESSONS_LEARNED:
    case SET_STANDARDS:
    case SET_ORGANIZATIONS:
    case SET_HELP_DOCS:
    case SET_HELP_SECTIONS:
    case SET_USERS:
      return normalizer(state, action);
    case ADD_STANDARD:
      return add(state, 'standards', action);
    case UPDATE_STANDARD:
      return update(state, 'standards', action);
    case REMOVE_STANDARD:
      return remove(state, 'standards', action);
    default:
      return state;
  }
}
