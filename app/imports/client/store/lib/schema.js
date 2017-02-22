import { schema } from 'normalizr';

const entity = (name, relations, { idAttribute = '_id', ...options } = {}) =>
  new schema.Entity(name, relations, { idAttribute, ...options });

export const department = entity('departments');

export const file = entity('files');

export const nc = entity('ncs');

export const risk = entity('risks');

export const action = entity('actions');

export const workItem = entity('workItems');

export const standardBookSection = entity('standardBookSections');

export const standardType = entity('standardTypes');

export const lesson = entity('lessons');

export const organization = entity('organizations');

export const standard = entity('standards');

export const helpDoc = entity('helpDocs');

export const user = entity('users');

export const message = entity('messages');
