import { normalize } from 'normalizr';
import merge from 'lodash.merge';
import set from 'lodash.set';
import { omitC, withoutC } from '/imports/api/helpers';
import schemas from './schema';

export const normalizeData = (state, action) => {
  const key = Object.keys(action.payload)[0];
  const schema = schemas[key.substring(0, key.length - 1)];
  const entitiesSchema = { [key]: [schema] };
  const normalizedData = normalize(action.payload, entitiesSchema);
  const data = {
    entities: normalizedData.entities[key],
    allIds: normalizedData.result[key],
  };
  return merge({}, state, data);
};

export const add = (state, action) => ({
  entities: { ...state.entities, [action.payload._id]: action.payload },
  allIds: [...state.allIds, action.payload._id],
});

export const update = (state, action) =>
  set({ ...state }, `entities.${action.payload._id}`, action.payload);

export const remove = (state, action) => {
  const entities = omitC([action.payload], state.entities);
  const allIds = withoutC([action.payload], state.allIds);
  const newState = {
    ...state,
    entities,
    allIds,
  };

  return newState;
};
