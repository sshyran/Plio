import { _ } from 'meteor/underscore';

import { Organizations } from '/imports/share/collections/organizations.js';
import { createOrgQueryWhereUserIsMember } from '../queries';

/**
 * Get the date of joining the user to the organisation:
 * @param {String} organizationId - the organisation ID;
 * @param {String} userId - the user ID;
*/
export const getJoinUserToOrganizationDate = ({ organizationId, userId }) => {
  const org = Organizations.findOne({ _id: organizationId });

  if (!org) return undefined;

  const orgUsers = org.users;
  const currentUserInOrg = _.find(orgUsers, user => user.userId === userId);

  return currentUserInOrg && currentUserInOrg.joinedAt;
};

export const getUserOrganizations = (userId, orgSelector = {}, options = {}) => {
  const selector = {
    ...createOrgQueryWhereUserIsMember(userId),
    ...orgSelector,
  };

  return Organizations.find(selector, options);
};
