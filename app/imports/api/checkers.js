import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import curry from 'lodash.curry';
import { _ } from 'meteor/underscore';

import { AnalysisStatuses, UserRoles } from '/imports/share/constants.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import {
  NOT_AN_ORG_MEMBER,
  DOC_NOT_FOUND,
  ONLY_ORG_OWNER_CAN_DELETE,
  CANNOT_RESTORE_NOT_DELETED,
} from './errors.js';
import { chain, checkAndThrow, injectCurry, getUserJoinedAt } from './helpers.js';
import { MOBILE_BREAKPOINT } from '/imports/api/constants';
import { createOrgQueryWhereUserIsOwner, createOrgQueryWhereUserIsMember } from './queries';

const { compose } = _;

export * from './actions/checkers.js';

export * from './work-items/checkers.js';

export * from './problems/checkers.js';

export * from './standards/checkers.js';

export * from './organizations/checkers.js';

export * from './occurrences/checkers.js';

export * from './users/checkers.js';

export * from './discussions/checkers.js';

export const isMobileRes = () => {
  const width = $(window).width();
  return width <= MOBILE_BREAKPOINT && width;
};

const userIdOrgIdTester = (userId, organizationId) => _.every([
  SimpleSchema.RegEx.Id.test(userId),
  SimpleSchema.RegEx.Id.test(organizationId)
]);

export const canChangeStandards = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
    organizationId
  );
};

export const canChangeOrgSettings = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.CHANGE_ORG_SETTINGS,
    organizationId
  );
};

export const canInviteUsers = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.INVITE_USERS,
    organizationId
  );
};

export const canDeleteUsers = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.DELETE_USERS,
    organizationId
  );
};

export const canChangeRoles = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.EDIT_USER_ROLES,
    organizationId
  );
};

export const isOrgOwner = (userId, organizationId) => {
  if (!userIdOrgIdTester(userId, organizationId)) return false;

  const query = {
    _id: organizationId,
    ...createOrgQueryWhereUserIsOwner(userId),
  };

  return !!Organizations.findOne(query);
};

export const isPlioUser = (userId) => {
  const adminOrg = Organizations.findOne({ isAdminOrg: true });

  if (adminOrg === undefined) {
    return false;
  }

  return _.find(adminOrg.users, user => user.userId === userId) !== undefined;
};

export const isPlioAdmin = (userId) => {
  if (!SimpleSchema.RegEx.Id.test(userId)) {
    return false;
  }

  return !!Organizations.findOne({
    isAdminOrg: true,
    ...createOrgQueryWhereUserIsOwner(userId),
  });
};

export const canChangeHelpDocs = (userId) => {
  const query = {
    isAdminOrg: true,
    ...createOrgQueryWhereUserIsMember(userId),
  };
  const { _id: adminOrgId } = Object.assign({}, Organizations.findOne(query));

  return !!adminOrgId && canChangeStandards(userId, adminOrgId);
};

export const isOrgMemberBySelector = (userId, selector) => {
  return !!Organizations.findOne({
    ...selector,
    ...createOrgQueryWhereUserIsMember(userId),
  });
};

export const isOrgMember = (userId, organizationId) => {
  if (!userIdOrgIdTester(userId, organizationId)) return false;

  return isOrgMemberBySelector(userId, { _id: organizationId });
};

export const checkAnalysis = ({ analysis = {}, updateOfStandards = {}, ...rest }, args = {}) => {
  const isCompleted = ({ status = '' }) => status.toString() === _.invert(AnalysisStatuses)['Completed'];
  const findArg = _args => _find => _.keys(_args).find(key => key.includes(_find));
  const findSubstring = (str = '', ...toFind) => toFind.find(s => str.includes(s));
  const checkAnalysisAndThrow = (predicate) => {
    if (!predicate) {
      throw new Meteor.Error(403, 'Access denied');
    }
  };

  const isAnalysisCompleted = isCompleted(analysis);
  const isUpdateOfStandardsCompleted = isCompleted(updateOfStandards);

  const find = findArg(args);

  const isAnalysis = find('analysis');
  const isUpdateOfStandards = find('updateOfStandards');

  if (find('analysis.status') || find('updateOfStandards.status')) {
    checkAnalysisAndThrow(analysis || analysis.executor || analysis.executor === this.userId);
  }

  if ( find('updateOfStandards') || (isAnalysis && findSubstring(isAnalysis, 'completedAt', 'completedBy')) ) {
    checkAnalysisAndThrow(isAnalysisCompleted);
  }

  if (findSubstring(isUpdateOfStandards, 'completedAt', 'completedBy')) {
    checkAnalysisAndThrow(isUpdateOfStandardsCompleted);
  }

  return { analysis, updateOfStandards, ...rest };
};

export const isViewed = (doc, userId) => {
  const { viewedBy = [] } = Object.assign({}, doc);
  return viewedBy.includes(userId);
};

export const checkOrgMembership = curry((userId, organizationId) => {
  return checkAndThrow(!isOrgMember(userId, organizationId), NOT_AN_ORG_MEMBER);
});

export const checkOrgMembershipBySelector = curry((userId, selector) =>
  checkAndThrow(!isOrgMemberBySelector(userId, selector), NOT_AN_ORG_MEMBER));

export const checkOrgMembershipByDoc = (collection, query, userId) => {
  const doc = Object.assign({}, collection.findOne(query));

  checkOrgMembership(userId, doc.organizationId);

  return doc;
};

export const checkDocExistance = (collection, query) => {
  const doc = collection.findOne(query);

  checkAndThrow(!doc, DOC_NOT_FOUND);

  return doc;
};

export const checkDocAndMembership = (collection, _id, userId) =>
  chain(checkDocExistance, checkOrgMembershipByDoc)(collection, _id, userId);

export const checkDocAndMembershipAndMore = (collection, _id, userId) => {
  const [doc] = checkDocAndMembership(collection, _id, userId);
  return (predicate, err) => {
    if (!err) return predicate(doc);

    checkAndThrow(predicate(doc), err);

    return doc;
  };
};

export const exists = collection => fn => (...args) => {
  return compose(injectCurry(collection, checkDocExistance), fn)(...args);
};

export const wrap = curry((predicate, error) => curry((args, doc) => {
  checkAndThrow(predicate(args, doc), error);

  return doc;
}));

export const onRemoveChecker = wrap(({ userId }, doc) => {
  return doc.isDeleted && !isOrgOwner(userId, doc.organizationId);
}, ONLY_ORG_OWNER_CAN_DELETE);

export const onRestoreChecker = wrap((_, doc) => {
  return !doc.isDeleted;
}, CANNOT_RESTORE_NOT_DELETED);

export const isNewDoc = (organization, userId, { createdAt, viewedBy }) => {
  if (!organization || !userId || !(viewedBy instanceof Array)) return false;

  const joinedAt = getUserJoinedAt(organization, userId);

  if (!joinedAt) return false;

  return !viewedBy.includes(userId) && createdAt > joinedAt;
};
