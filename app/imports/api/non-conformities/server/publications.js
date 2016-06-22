import { Meteor } from 'meteor/meteor';
import { NonConformities } from '../non-conformities.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';

Meteor.publish('nonConformities', function(organizationId, isDeleted = { $in: [null, false] }) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return NonConformities.find({ organizationId, isDeleted });
});

Meteor.publish('nonConformitiesByStandardId', function(standard, isDeleted = { $in: [null, false] }) {
  if (this.userId) {
    return NonConformities.find({ standard, isDeleted });
  } else {
    return this.ready();
  }
});

Meteor.publish('nonConformitiesCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, NonConformities.find({
    organizationId,
    isDeleted: { $in: [false, null] }
  }));
});

Meteor.publish('nonConformitiesNotViewedCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, NonConformities.find({
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] }
  }));
});
