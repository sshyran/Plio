import { UserMembership } from '/imports/share/constants';

export const createOrgUserMatcher = (userId, matcher) => ({
  userId,
  isRemoved: false,
  removedBy: { $exists: false },
  removedAt: { $exists: false },
  ...matcher,
});

export const createOrgQueryWhereUserIsMember = (userId) => ({
  users: {
    $elemMatch: createOrgUserMatcher(userId),
  },
});

export const createOrgQueryWhereUserIsOwner = (userId) => ({
  users: {
    $elemMatch: createOrgUserMatcher(userId, { role: UserMembership.ORG_OWNER }),
  },
});
