import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { Organizations } from '/imports/share/collections/organizations';
import { StandardTypes } from '/imports/share/collections/standards-types';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { getUserOrganizations } from '../utils';
import { isPlioUser, isOrgMember } from '../../checkers';
import { makeOptionsFields } from '../../helpers';
import { UserMembership } from '/imports/share/constants';
import { createOrgQueryWhereUserIsOwner } from '../../queries';


Meteor.publish('invitationInfo', (invitationId) => {
  const sendInternalError = (message) => this.error(new Meteor.Error(500, message));

  if (!SimpleSchema.RegEx.Id.test(invitationId)) {
    sendInternalError('Incorrect invitation ID!');
    return undefined;
  }

  const invitedUserCursor = Meteor.users.find({
    invitationId,
  }, {
    fields: { emails: 1, invitationId: 1, invitationOrgId: 1 },
  });

  if (invitedUserCursor.count() === 0) {
    sendInternalError('Invitation do not exist');
    return undefined;
  }

  const { _id: invitedUserId, invitationOrgId } = invitedUserCursor.fetch()[0];

  return [
    invitedUserCursor,
    Organizations.find({
      _id: invitationOrgId,
      'users.userId': invitedUserId,
    }, {
      limit: 1,
      fields: { name: 1, serialNumber: 1 },
    }),
  ];
});

Meteor.publish('currentUserOrganizations', function() {
  if (this.userId) {
    return getUserOrganizations(this.userId, {}, {
      fields: {
        name: 1,
        serialNumber: 1,
        'users.userId': 1,
        'users.role': 1,
        'users.isRemoved': 1,
        'users.removedAt': 1,
        'users.removedBy': 1,
        'users.sendDailyRecap': 1,
      },
    });
  } else {
    return this.ready();
  }
});

Meteor.publish('currentUserOrganizationById', function(_id) {
  if (this.userId) {
    return getUserOrganizations(this.userId, { _id });
  } else {
    return this.ready();
  }
});

Meteor.publish('currentUserOrganizationBySerialNumber', function(serialNumber) {
  const fields = {
    _id: 1,
    name: 1,
    serialNumber: 1,
    users: 1,
    timezone: 1,
    currency: 1,
    workflowDefaults: 1,
    reminders: 1,
    ncGuidelines: 1,
    rkGuidelines: 1,
    rkScoringGuidelines: 1,
    review: 1,
    homeScreenTitles: 1,
    isAdminOrg: 1,
    createdAt: 1,
    createdBy: 1,
    updatedAt: 1,
    updatedBy: 1,
    lastAccessedDate: 1,
  };

  if (this.userId) {
    return getUserOrganizations(this.userId, { serialNumber }, { fields });
  } else {
    return this.ready();
  }
});

Meteor.publish('dataImportUserOwnOrganizations', function publishDataImportUserOwnOrgs() {
  const userId = this.userId;

  if (!userId) return this.ready();

  const query = createOrgQueryWhereUserIsOwner(userId);
  const fields = {
    _id: 1,
    name: 1,
    ...query,
  };
  const options = { fields };

  return Organizations.find(query, options);
});

Meteor.publish('transferredOrganization', function(transferId) {
  const userId = this.userId;
  const organizationCursor = Organizations.find({
    'transfer._id': transferId,
  });
  const organization = organizationCursor.fetch()[0];

  if (userId && organization) {
    if (organization.transfer && organization.transfer.newOwnerId === userId) {
      return organizationCursor;
    } else {
      throw new Meteor.Error(403, 'Your account is not authorized for this action. Sign out and login as a proper user'); // 'Your account is not authorized for this action'
      return this.ready();
    }
  } else {
    throw new Meteor.Error(404, 'An invitation to transfer the organization is not found');
    return this.ready();
  }
});

Meteor.publish('organizationDeps', function(organizationId) {
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const organization = Organizations.findOne({ _id: organizationId });
  const userIds = _.pluck(organization.users, 'userId');

  const query = { organizationId };

  const standardsBookSections = StandardsBookSections.find(
    query,
    makeOptionsFields(StandardsBookSections.publicFields)
  );
  const standardsTypes = StandardTypes.find(query, makeOptionsFields(StandardTypes.publicFields));
  const riskTypes = RiskTypes.find(query);
  const users = Meteor.users.find({ _id: { $in: userIds } });

  return [
    standardsBookSections,
    standardsTypes,
    riskTypes,
    users,
  ];
});

Meteor.publishComposite('organizationsInfo', {
  find() {
    const userId = this.userId;

    if (userId && isPlioUser(userId)) {
      return Organizations.find({}, {
        fields: {
          name: 1,
          users: 1,
          createdAt: 1,
          lastAccessedDate: 1,
        },
      });
    }

    throw new Meteor.Error(403,
      'Your account is not authorized for this action. Sign out and login as a proper user'
    );
  },

  children: [{
      find(organization) {
        const owner = _.find(organization.users, ({ role }) => {
          return role === UserMembership.ORG_OWNER;
        });

        return Meteor
          .users
          .find({ _id: owner.userId });
      }
  }],
});

Meteor.publishComposite('customersLayout', {
  find() {
    if (!this.userId || !isPlioUser(this.userId)) {
      return this.ready();
    }

    return Organizations.find({}, {
      fields: Organizations.listFields,
    });
  },
  children: [{
    find(organization) {
      return Meteor.users.find({
        _id: organization.ownerId(),
      }, {
        fields: {
          'emails.address': 1,
          'profile.firstName': 1,
          'profile.lastName': 1,
        },
      });
    },
  }],
});

Meteor.publish('customerCard', function getCustomerData(orgId) {
  if (!this.userId || !isPlioUser(this.userId)) {
    return this.ready();
  }

  return Organizations.find({ _id: orgId }, {
    fields: Organizations.cardFields,
  });
});
