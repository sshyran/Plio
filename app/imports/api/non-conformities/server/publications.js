import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Standards } from '/imports/share/collections/standards';
import { Occurrences } from '/imports/share/collections/occurrences';
import { Departments } from '/imports/share/collections/departments';
import { Risks } from '/imports/share/collections/risks';
import { isOrgMember } from '../../checkers.js';
import { ActionTypes } from '/imports/share/constants';
import Counter from '../../counter/server.js';
import {
  getCursorNonDeleted,
  makeOptionsFields,
} from '../../helpers';
import { getPublishCompositeOrganizationUsers } from '/imports/server/helpers/pub-helpers';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import {
  getActionsWithLimitedFields,
} from '../../actions/utils';
import {
  getProblemsWithLimitedFields,
} from '../../problems/utils';
import {
  createNonConformityCardPublicationTree,
  getNCOtherFiles,
} from '../../non-conformities/utils';

const getNCLayoutPub = (userId, serialNumber, isDeleted) => [
  {
    find({ _id: organizationId }) {
      const query = { organizationId, isDeleted };
      const options = { fields: NonConformities.publicFields };
      return NonConformities.find(query, options);
    },
    children: [
      {
        find: getDepartmentsCursorByIds,
      },
    ],
  },
];

Meteor.publishComposite(
  'nonConformitiesLayout',
  getPublishCompositeOrganizationUsers(getNCLayoutPub),
);

Meteor.publishComposite('nonConformitiesList', function (
  organizationId,
  isDeleted = { $in: [null, false] },
) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return NonConformities.find({ organizationId, isDeleted }, {
        fields: NonConformities.publicFields,
      });
    },
  };
});

Meteor.publishComposite('nonConformityCard', function ({ _id, organizationId }) {
  check(_id, String);
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return createNonConformityCardPublicationTree(() => ({ _id, organizationId }));
});

Meteor.publish('nonConformitiesDeps', function (organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const actionsQuery = {
    organizationId,
    type: {
      $in: [
        ActionTypes.CORRECTIVE_ACTION,
        ActionTypes.PREVENTATIVE_ACTION,
      ],
    },
  };

  const standardsFields = {
    title: 1,
    status: 1,
    organizationId: 1,
  };

  const departments = Departments.find(
    { organizationId },
    makeOptionsFields(Departments.publicFields)
  );
  const occurrences = Occurrences.find({ organizationId });
  const actions = getActionsWithLimitedFields(actionsQuery);
  const risks = getProblemsWithLimitedFields({ organizationId }, Risks);
  const standards = getCursorNonDeleted({ organizationId }, standardsFields, Standards);

  return [
    departments,
    occurrences,
    actions,
    risks,
    standards,
  ];
});

Meteor.publishComposite('nonConformitiesByStandardId', function (
  standardId,
  isDeleted = { $in: [null, false] },
) {
  return {
    find() {
      const userId = this.userId;
      const standard = Standards.findOne({ _id: standardId });
      const { organizationId } = !!standard && standard;

      if (!userId || !standard || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return NonConformities.find({ standardsIds: standardId, isDeleted });
    },
    children: [{
      find: getNCOtherFiles,
    }],
  };
});

Meteor.publishComposite('nonConformitiesByIds', function (ids = []) {
  return {
    find() {
      let query = {
        _id: { $in: ids },
        isDeleted: { $in: [null, false] },
      };

      const userId = this.userId;
      const { organizationId } = Object.assign({}, NonConformities.findOne(query));

      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      query = { ...query, organizationId };

      return NonConformities.find(query);
    },
    children: [{
      find: getNCOtherFiles,
    }],
  };
});

Meteor.publish('nonConformitiesCount', function (counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, NonConformities.find({
    organizationId,
    isDeleted: { $in: [false, null] },
  }));
});

Meteor.publish('nonConformitiesNotViewedCount', function (counterName, organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
    organizationId, userId,
  });
  const query = {
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] },
  };

  if (currentOrgUserJoinedAt) {
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  return new Counter(counterName, NonConformities.find(query));
});
