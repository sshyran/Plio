import { Meteor } from 'meteor/meteor';

export const ORG_CANNOT_CHANGE_SETTINGS = new Meteor.Error(
  403, 'User is not authorized for editing organization settings'
);

export const ORG_CANNOT_INVITE_USERS = new Meteor.Error(
  403, 'User is not authorized for inviting user\'s from this organization'
);

export const ORG_CANNOT_DELETE_USERS = new Meteor.Error(
  403, 'User is not authorized for removing user\'s from this organization'
);

export const ORG_OWNER_CANNOT_BE_DELETED = new Meteor.Error(
  400, 'Organization owner can\'t be removed'
);

export const ORG_USER_ALREADY_DELETED = new Meteor.Error(
  400, 'User is already removed'
);

export const ORG_CANNOT_DELETE = new Meteor.Error(
  403, 'User is not authorized for deleting organization'
);

export const ORG_CANNOT_UPDATE = new Meteor.Error(
  403, 'User is not authorized for updating organization'
);

export const ORG_ALREADY_ON_TRANSFER = new Meteor.Error(
  400, 'Organization is already on transfer'
);

export const ORG_ALREADY_OWNER = new Meteor.Error(
  400, 'The target user already owns the organization'
);

export const ORG_MUST_BE_MEMBER = new Meteor.Error(
  400, 'The target user must be a member of organization'
);

export const ORG_USER_SHOULD_HAVE_VERIFIED_EMAIL = new Meteor.Error(
  400, 'The target user should have a verified email address'
);

export const ORG_USER_NOT_ACCEPTED_INVITATION = new Meteor.Error(
  400, 'The target user hasn\'t accepted the invitation to the organization yet'
);

export const ORG_TRANSFER_CANCELED_COMPLETED = new Meteor.Error(
  400, 'Current organization owner canceled transfer or it is already completed'
);

export const ORG_ALREADY_EXISTS = name => new Meteor.Error(
  400, `Organization "${name}" already exists`
);

export const ORG_CAN_NOT_BE_DELETED = new Meteor.Error(
  400, 'Organization can not be deleted'
);

export const DOC_NOT_FOUND_OR_ALREADY_UNSUBSCRIBED = new Meteor.Error(
  400,
  'The document you are looking for is not found ' +
  'or you\'ve already unsubscribed from the daily recap'
);

export const CANNOT_IMPORT_DOCS = new Meteor.Error(
  403,
  'You cannot import documents from other organization' +
  ' as long as you have documents in your current organization',
);
