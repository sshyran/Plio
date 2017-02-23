import curry from 'lodash.curry';

import { Organizations } from '/imports/share/collections/organizations';
import {
  ORG_CANNOT_CHANGE_SETTINGS,
  ORG_ALREADY_EXISTS,
  ORG_CANNOT_INVITE_USERS,
  ORG_CANNOT_DELETE_USERS,
  ORG_OWNER_CANNOT_BE_DELETED,
  ORG_CANNOT_DELETE,
  ORG_CANNOT_UPDATE,
  ORG_ALREADY_ON_TRANSFER,
  ORG_ALREADY_OWNER,
  ORG_MUST_BE_MEMBER,
  ORG_USER_SHOULD_HAVE_VERIFIED_EMAIL,
  ORG_USER_NOT_ACCEPTED_INVITATION,
  ORG_TRANSFER_CANCELED_COMPLETED,
  ORG_USER_ALREADY_DELETED,
  ORG_CAN_NOT_BE_DELETED,
} from '../errors';
import {
  canChangeOrgSettings,
  canInviteUsers,
  canDeleteUsers,
  isOrgOwner,
  isOrgMember,
  checkOrgMembershipBySelector,
} from '../checkers';
import { checkAndThrow, checkAndThrowC, compose, invoker } from '../helpers';
import { getCollectionByDocType } from '/imports/share/helpers';
import { DOC_NOT_FOUND_OR_ALREADY_UNSUBSCRIBED, throwExpectedNoDocs } from './errors';


export const ORG_EnsureCanChange = (userId, organizationId) => {
  return checkAndThrow(!canChangeOrgSettings(userId, organizationId), ORG_CANNOT_CHANGE_SETTINGS);
};

export const ORG_EnsureCanChangeChecker = ({ userId }, doc) => {
  ORG_EnsureCanChange(userId, doc.organizationId);

  return doc;
};

export const ORG_EnsureCanChangeCheckerCurried = userId => curry(ORG_EnsureCanChangeChecker)({ userId });

export const ORG_EnsureCanInvite = (userId, organizationId) => {
  return checkAndThrow(!canInviteUsers(userId, organizationId), ORG_CANNOT_INVITE_USERS);
};

export const ORG_EnsureNameIsUnique = ({ name }, doc) => {
  const nameIsUnique = !Organizations.findOne({
    name: new RegExp(`^${name}$`, 'i')
  });

  checkAndThrow(!nameIsUnique, ORG_ALREADY_EXISTS(name));

  return doc;
};

export const ORG_EnsureUserIsNotAlreadyDeleted = (userId, organizationId) => {
  const isAlreadyRemoved = !!Organizations.findOne({
    _id: organizationId,
    users: {
      $elemMatch: {
        userId,
        isRemoved: true,
        removedBy: {$exists: true},
        removedAt: {$exists: true}
      }
    }
  });

  return checkAndThrow(isAlreadyRemoved, ORG_USER_ALREADY_DELETED);
};

export const ORG_EnsureCanDeleteUsers = (userToDeleteId, userId, organizationId) => {
  const predicate = Object.is(userToDeleteId, userId) && !canDeleteUsers(userId, organizationId);

  checkAndThrow(predicate, ORG_CANNOT_DELETE_USERS);

  checkAndThrow(isOrgOwner(userToDeleteId, organizationId), ORG_OWNER_CANNOT_BE_DELETED);

  ORG_EnsureUserIsNotAlreadyDeleted(userToDeleteId, organizationId);

  return true;
};

export const ORG_IsOnTransfer = (organizationId) => {
  return !!Organizations.findOne({
    _id: organizationId,
    transfer: { $exists: true }
  });
};

export const ORG_EnsureIsOwner = (userId, organizationId) => {
  return checkAndThrow(!isOrgOwner(userId, organizationId), ORG_CANNOT_UPDATE);
};

export const ORG_EnsureCanDelete = (userId, organizationId) => {
  return checkAndThrow(!isOrgOwner(userId, organizationId), ORG_CANNOT_DELETE);
};

export const ORG_EnsureCanTransfer = (userToTransferId, userId, organizationId) => {
  checkAndThrow(Object.is(userToTransferId, userId), ORG_ALREADY_OWNER);

  checkAndThrow(!isOrgMember(userToTransferId, organizationId), ORG_MUST_BE_MEMBER);

  const userToTransfer = Meteor.users.findOne({ _id: userToTransferId });

  checkAndThrow(!userToTransfer.hasVerifiedEmail(), ORG_USER_SHOULD_HAVE_VERIFIED_EMAIL);

  checkAndThrow(!userToTransfer.hasAcceptedInvite(), ORG_USER_NOT_ACCEPTED_INVITATION);

  return true;
};

export const ORG_OnTransferCreateChecker = (userToTransferId, userId, organizationId) => {
  ORG_EnsureIsOwner(userId, organizationId);

  checkAndThrow(ORG_IsOnTransfer(organizationId), ORG_ALREADY_ON_TRANSFER);

  ORG_EnsureCanTransfer(userToTransferId, userId, organizationId);

  return true;
};

export const ORG_OnTransferChecker = (userToTransferId, transferId) => {
  const organization = Organizations.findOne({
    'transfer._id': transferId,
    'transfer.newOwnerId': userToTransferId,
  });

  checkAndThrow(!organization, ORG_TRANSFER_CANCELED_COMPLETED);

  ORG_EnsureCanTransfer(userToTransferId, organization.ownerId(), organization._id);

  return organization;
};

export const ORG_EnsureCanBeDeleted = (organizationId) => {
  const { isAdminOrg } = Organizations.findOne({
    _id: organizationId
  }, {
    fields: { isAdminOrg: 1 }
  }) || {};

  checkAndThrow(isAdminOrg === true, ORG_CAN_NOT_BE_DELETED);
};

export const ensureCanUnsubscribeFromDailyRecap = ({ orgSerialNumber: serialNumber, userId }) => {
  checkOrgMembershipBySelector(userId, { serialNumber });

  const query = {
    serialNumber,
    users: {
      $elemMatch: {
        userId,
        sendDailyRecap: { $eq: true },
      },
    },
  };
  const doc = Organizations.findOne(query);

  checkAndThrow(!doc, DOC_NOT_FOUND_OR_ALREADY_UNSUBSCRIBED);

  return doc;
};

export const ensureThereIsNoDocuments = curry((err, docType, organizationId) => compose(
  checkAndThrowC(err),
  invoker(0, 'count'),
  invoker(1, 'find')({ organizationId, isDeleted: false }),
  getCollectionByDocType
)(docType));
