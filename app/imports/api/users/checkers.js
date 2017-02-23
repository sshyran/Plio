import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import curry from 'lodash.curry';
import get from 'lodash.get';

import {
  USR_CANNOT_UPDATE_ANOTHER,
  USR_CANNOT_CHANGE_ROLES,
  USR_CANNOT_CHANGE_ORG_OWNER_ROLES,
  USR_NOT_EXIST,
  USR_INCORRECT_PASSWORD,
  ACCESS_DENIED,
 } from '../errors.js';
import { checkAndThrow } from '/imports/api/helpers.js';
import { canChangeRoles, isOrgOwner, isPlioAdmin, isPlioUser } from '../checkers.js';

export const USR_EnsureUpdatingHimselfChecker = curry(({ userId }, doc) => {
  const predicate = Object.is(userId, doc._id);

  checkAndThrow(!predicate, USR_CANNOT_UPDATE_ANOTHER);

  return doc;
});

export const ensureCanChangeRoles = curry((userId, organizationId) => {
  const predicate = canChangeRoles(userId, organizationId);

  return checkAndThrow(!predicate, USR_CANNOT_CHANGE_ROLES);
});

export const USR_EnsureCanChangeRolesChecker = curry(({ userId }, doc) => {
  ensureCanChangeRoles(userId, doc.organizationId);

  return doc;
});

export const USR_EnsureIsNotOrgOwnerChecker = (doc) => {
  const predicate = isOrgOwner(doc._id, doc.organizationId);

  checkAndThrow(predicate, USR_CANNOT_CHANGE_ORG_OWNER_ROLES);

  return doc;
};

export const USR_EnsurePasswordIsValid = curry((userId, password) => {
  if (!Meteor.isServer) {
    return false;
  }

  const user = Meteor.users.findOne({ _id: userId });
  checkAndThrow(!user, USR_NOT_EXIST);

  const hasPassword = !!get(user, 'services.password.bcrypt');
  checkAndThrow(!hasPassword, USR_INCORRECT_PASSWORD);

  const checkPasswordResult = Accounts._checkPassword(user, {
    digest: password,
    algorithm: 'sha-256',
  });

  checkAndThrow(!!checkPasswordResult.error, USR_INCORRECT_PASSWORD);
});

export const USR_EnsureIsPlioAdmin = (userId) => {
  checkAndThrow(!isPlioAdmin(userId), ACCESS_DENIED);
};

export const USR_EnsureIsPlioUser = (userId) =>
  checkAndThrow(!isPlioUser(userId), ACCESS_DENIED);
