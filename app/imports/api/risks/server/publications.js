import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils';
import { Risks } from '/imports/share/collections/risks';
import { Standards } from '/imports/share/collections/standards';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { isOrgMember } from '../../checkers';
import { Departments } from '/imports/share/collections/departments';
import { NonConformities } from '/imports/share/collections/non-conformities';
import Counter from '../../counter/server';
import {
  makeOptionsFields,
  getCursorNonDeleted,
  always,
} from '../../helpers';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import { getActionsWithLimitedFields } from '../../actions/utils';
import { getProblemsWithLimitedFields } from '../../problems/utils';
import { ActionTypes } from '/imports/share/constants';
import { getRiskFiles, createRiskCardPublicationTree } from '../utils';
import { getPublishCompositeOrganizationUsers } from '/imports/server/helpers/pub-helpers';

const getRisksLayoutPub = (userId, serialNumber, isDeleted) => [
  {
    find({ _id: organizationId }) {
      return RiskTypes.find({ organizationId });
    },
  },
  {
    find({ _id: organizationId }) {
      const query = { organizationId, isDeleted };
      const options = { fields: Risks.publicFields };

      return Risks.find(query, options);
    },
    children: [
      {
        find: getDepartmentsCursorByIds,
      },
    ],
  },
];

Meteor.publishComposite('risksLayout', getPublishCompositeOrganizationUsers(getRisksLayoutPub));

Meteor.publishComposite('risksList', function (
  organizationId,
  isDeleted = { $in: [null, false] },
) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Risks.find({ organizationId, isDeleted }, {
        fields: Risks.publicFields,
      });
    },
  };
});

Meteor.publishComposite('riskCard', function ({ _id, organizationId }) {
  check(_id, String);
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return createRiskCardPublicationTree(always({ _id, organizationId }));
});

Meteor.publish('risksDeps', function (organizationId) {
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
    makeOptionsFields(Departments.publicFields),
  );
  const actions = getActionsWithLimitedFields(actionsQuery);
  const NCs = getProblemsWithLimitedFields({ organizationId }, NonConformities);
  const standards = getCursorNonDeleted({ organizationId }, standardsFields, Standards);

  return [
    departments,
    actions,
    NCs,
    standards,
  ];
});

Meteor.publishComposite('risksByStandardId', function (
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

      return Risks.find({ standardId, isDeleted });
    },
    children: [
      {
        find: getRiskFiles,
      },
    ],
  };
});

Meteor.publishComposite('risksByIds', function (ids = []) {
  return {
    find() {
      let query = {
        _id: { $in: ids },
        isDeleted: { $in: [null, false] },
      };

      const userId = this.userId;
      const { organizationId } = Object.assign({}, Risks.findOne({ ...query }));

      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      query = { ...query, organizationId };

      return Risks.find(query);
    },
    children: [{
      find(risk) {
        return getRiskFiles(risk);
      },
    }],
  };
});

Meteor.publish('risksCount', function (counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Risks.find({
    organizationId,
    isDeleted: { $in: [false, null] },
  }));
});

Meteor.publish('risksNotViewedCount', function (counterName, organizationId) {
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

  return new Counter(counterName, Risks.find(query));
});
