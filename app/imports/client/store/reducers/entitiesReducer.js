import { normalize } from 'normalizr';
import merge from 'lodash.merge';
import mergeWith from 'lodash.mergewith';
import set from 'lodash.set';
import * as schemas from '../lib/schema';

import { omitC, withoutC } from '/imports/api/helpers';

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

const normalizeData = (state, action) => {
  const key = Object.keys(action.payload)[0];
  const schema = schemas[key.substring(0, key.length - 1)];
  const entitiesSchema = { [key]: [schema] };
  const normalizedData = normalize(action.payload, entitiesSchema);
  const dataKey = Object.keys(normalizedData.entities)[0];
  const data = {
    [dataKey]: {
      entities: normalizedData.entities[dataKey],
      allIds: normalizedData.result[dataKey],
    },
  };
  return merge({}, state, data);
};

const add = (path, state, action) => {
  const customizer = (objValue, srcValue) => (Array.isArray(objValue)
    ? objValue.concat(srcValue)
    : undefined);

  const newState = {
    [path]: {
      entities: { [action.payload._id]: action.payload },
      allIds: [action.payload._id],
    },
  };

  return mergeWith(state, newState, customizer);
};

const update = (path, state, action) =>
  set({ ...state }, `${path}.entities.${action.payload._id}`, action.payload);

const remove = (path, state, action) => {
  const entities = omitC([action.payload], state[path].entities);
  const allIds = withoutC([action.payload], state[path].allIds);
  const newState = {
    ...state,
    [path]: { ...state[path], entities, allIds },
  };
  return newState;
};

const initialState = Object.keys(schemas).reduce((acc, key) => ({
  ...acc,
  [schemas[key]._key]: { entities: {}, allIds: [] },
}), {});

export default function reducer(state = initialState, action) {
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
      return normalizeData(state, action);
    case ADD_STANDARD:
      return add('standards', state, action);
    case UPDATE_STANDARD:
      return update('standards', state, action);
    case REMOVE_STANDARD:
      return remove('standards', state, action);
    default:
      return state;
  }
}
