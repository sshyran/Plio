import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

import { Organizations } from '/imports/share/collections/organizations';
import StandardsBookSectionService from
  '../../standards-book-sections/standards-book-section-service';
import StandardsTypeService from '../../standards-types/standards-type-service';
import RisksTypeService from '../../risk-types/risk-types-service';
import {
  DefaultStandardSections,
  DefaultStandardTypes,
  DefaultRiskTypes,
  OrganizationDefaults,
  OrgOwnerRoles,
  OrgMemberRoles,
  UserMembership,
  UserRoles,
} from '/imports/share/constants';
import { generateSerialNumber } from '/imports/share/helpers';
import OrgNotificationsSender from '../org-notifications-sender';
import { Actions } from '/imports/share/collections/actions';
import { AuditLogs } from '/imports/share/collections/audit-logs';
import { Departments } from '/imports/share/collections/departments';
import { Discussions } from '/imports/share/collections/discussions';
import { Files } from '/imports/share/collections/files';
import { LessonsLearned } from '/imports/share/collections/lessons';
import { Messages } from '/imports/share/collections/messages';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Occurrences } from '/imports/share/collections/occurrences';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { Risks } from '/imports/share/collections/risks';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import { Standards } from '/imports/share/collections/standards';
import { WorkItems } from '/imports/share/collections/work-items';
import importDocuments from './importDocuments';

const OrganizationService = {
  importDocuments,

  collection: Organizations,

  insert({ name, timezone, currency, ownerId }) {
    const serialNumber = generateSerialNumber(this.collection, {}, 100);

    const {
      workflowDefaults,
      reminders,
      ncGuidelines,
      rkGuidelines,
      rkScoringGuidelines,
      review,
    } = OrganizationDefaults;

    const organizationId = this.collection.insert({
      name,
      timezone,
      currency,
      serialNumber,
      users: [{
        userId: ownerId,
        role: UserMembership.ORG_OWNER,
      }],
      workflowDefaults,
      reminders,
      ncGuidelines,
      rkGuidelines,
      rkScoringGuidelines,
      review,
      createdBy: ownerId,
    });

    _.each(DefaultStandardSections, ({ title }) => {
      StandardsBookSectionService.insert({
        title,
        organizationId,
        createdBy: ownerId,
      });
    });

    _.each(DefaultStandardTypes, ({ title, abbreviation }) => {
      StandardsTypeService.insert({
        title,
        abbreviation,
        organizationId,
        createdBy: ownerId,
      });
    });

    _.each(DefaultRiskTypes, ({ title }) => {
      RisksTypeService.insert({
        title,
        organizationId,
        createdBy: ownerId,
      });
    });

    Roles.addUsersToRoles(ownerId, OrgOwnerRoles, organizationId);

    new OrgNotificationsSender(organizationId).orgCreated();

    return organizationId;
  },

  remove() {

  },

  setName({ _id, name }) {
    return this.collection.update({ _id }, {
      $set: { name },
    });
  },

  setTimezone({ _id, timezone }) {
    return this.collection.update({ _id }, {
      $set: { timezone },
    });
  },

  setDefaultCurrency({ _id, currency }) {
    return this.collection.update({ _id }, {
      $set: { currency },
    });
  },

  setWorkflowDefaults({ _id, type, ...args }) {
    const $set = {};
    for (let key in args) {
      $set[`workflowDefaults.${type}.${key}`] = args[key];
    }

    return this.collection.update({ _id }, { $set });
  },

  setReminder({ _id, type, reminderType, timeValue, timeUnit }) {
    return this.collection.update({ _id }, {
      $set: {
        [`reminders.${type}.${reminderType}`]: { timeValue, timeUnit },
      },
    });
  },

  setReviewReviewerId({ _id, documentKey, reviewerId }) {
    const query = { _id };
    const modifier = {
      $set: {
        [`review.${documentKey}.reviewerId`]: reviewerId,
      },
    };

    return this.collection.update(query, modifier);
  },

  setReviewFrequency({ _id, documentKey, frequency }) {
    return this.collection.update({ _id }, {
      $set: {
        [`review.${documentKey}.frequency`]: frequency,
      },
    });
  },

  setReviewAnnualDate({ _id, documentKey, annualDate }) {
    return this.collection.update({ _id }, {
      $set: {
        [`review.${documentKey}.annualDate`]: annualDate,
      },
    });
  },

  setReviewReminderTimeValue({ _id, documentKey, reminderType, timeValue }) {
    return this.collection.update({ _id }, {
      $set: {
        [`review.${documentKey}.reminders.${reminderType}.timeValue`]: timeValue,
      },
    });
  },

  setReviewReminderTimeUnit({ _id, documentKey, reminderType, timeUnit }) {
    return this.collection.update({ _id }, {
      $set: {
        [`review.${documentKey}.reminders.${reminderType}.timeUnit`]: timeUnit,
      },
    });
  },

  setNCGuideline({ _id, type, text }) {
    return this.collection.update({ _id }, {
      $set: {
        [`ncGuidelines.${type}`]: text,
      },
    });
  },

  setRKGuideline({ _id, type, text }) {
    const query = { _id };
    const options = {
      $set: {
        [`rkGuidelines.${type}`]: text,
      },
    };
    return this.collection.update(query, options);
  },

  setRKScoringGuidelines({ _id, rkScoringGuidelines }) {
    const query = { _id };
    const options = { $set: { rkScoringGuidelines } };
    return this.collection.update(query, options);
  },

  removeUser({ userId, organizationId, removedBy }) {
    Roles.removeUsersFromRoles(
      userId, _.values(UserRoles), organizationId
    );

    const ret = this.collection.update({
      _id: organizationId,
      'users.userId': userId,
    }, {
      $set: {
        'users.$.isRemoved': true,
        'users.$.removedBy': removedBy,
        'users.$.removedAt': new Date(),
      },
    });

    Meteor.isServer && Meteor.defer(() =>
      new OrgNotificationsSender(organizationId).userRemoved(userId, removedBy)
    );

    return ret;
  },

  createTransfer({ organizationId, newOwnerId, currOwnerId }) {
    const transferId = Random.id();

    this.collection.update({
      _id: organizationId,
    }, {
      $set: {
        transfer: {
          newOwnerId,
          _id: transferId,
          createdAt: new Date(),
        },
      },
    });

    Meteor.isServer && Meteor.defer(() =>
      new OrgNotificationsSender(organizationId).transferCreated(
        newOwnerId, transferId, currOwnerId
      )
    );
  },

  transfer({ newOwnerId, transferId }, organization) {
    const organizationId = organization._id;
    const currOwnerId = organization.ownerId();

    this.collection.update({
      _id: organizationId,
      'users.userId': newOwnerId,
    }, {
      $set: {
        'users.$.role': UserMembership.ORG_OWNER,
      },
    });

    Roles.removeUsersFromRoles(currOwnerId, OrgMemberRoles, organizationId);
    Roles.addUsersToRoles(newOwnerId, OrgOwnerRoles, organizationId);

    this.collection.update({
      _id: organizationId,
      'users.userId': currOwnerId,
    }, {
      $set: {
        'users.$.role': UserMembership.ORG_MEMBER,
      },
    });

    Roles.removeUsersFromRoles(currOwnerId, OrgOwnerRoles, organizationId);
    Roles.addUsersToRoles(currOwnerId, OrgMemberRoles, organizationId);

    this.collection.update({
      _id: organizationId,
    }, {
      $unset: { transfer: '' },
    });

    Meteor.isServer && Meteor.defer(() =>
      new OrgNotificationsSender(organizationId).transferCompleted(newOwnerId, currOwnerId)
    );
  },

  cancelTransfer({ organizationId }) {
    return this.collection.update({
      _id: organizationId,
    }, {
      $unset: { transfer: '' },
    });
  },

  updateUserSettings({ organizationId, userId, ...args }) {
    const modifier = {};
    _(args).each((val, key) => {
      _(modifier).extend({ [`users.$.${key}`]: val });
    });

    return this.collection.update({
      _id: organizationId,
      'users.userId': userId,
    }, {
      $set: { ...modifier },
    });
  },

  setTitleValue({ organizationId, fieldName, fieldValue }) {
    return this.collection.update({
      _id: organizationId,
    }, {
      $set: { [`homeScreenTitles.${fieldName}`]: fieldValue },
    });
  },

  deleteOrganization({ organizationId }) {
    const organization = this.collection.findOne({ _id: organizationId }, {
      fields: { 'users.userId': 1 },
    });

    const orgUsersIds = _(organization.users).pluck('userId');
    Roles.removeUsersFromRoles(
      orgUsersIds,
      _.union(OrgOwnerRoles, OrgMemberRoles),
      organizationId
    );

    const collections = [
      Actions,
      AuditLogs,
      Departments,
      Discussions,
      Files,
      LessonsLearned,
      Messages,
      NonConformities,
      Occurrences,
      RiskTypes,
      Risks,
      StandardsBookSections,
      StandardTypes,
      Standards,
      WorkItems,
    ];

    _(collections).each(coll => coll.direct.remove({ organizationId }));

    return this.collection.remove({ _id: organizationId });
  },

  changeCustomerType({ organizationId, customerType }) {
    const query = { _id: organizationId };
    const modifier = {
      $set: {
        customerType,
      },
    };

    return this.collection.update(query, modifier);
  },

  unsubscribeFromDailyRecap({ orgSerialNumber, userId }) {
    const query = {
      serialNumber: orgSerialNumber,
      users: {
        $elemMatch: {
          userId,
          sendDailyRecap: true,
        },
      },
    };
    const modifier = {
      $set: {
        'users.$.sendDailyRecap': false,
      },
    };

    return this.collection.update(query, modifier);
  },

  updateLastAccessedDate({ organizationId }) {
    const query = { _id: organizationId };
    const modifier = {
      $set: {
        lastAccessedDate: new Date,
      },
    };
    return this.collection.update(query, modifier);
  },
};

export default OrganizationService;
