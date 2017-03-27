import { _ } from 'meteor/underscore';

import {
  ONLY_OWNER_CAN_CHANGE,
  P_CANNOT_SET_EXECUTOR_FOR_COMPLETED_ANALYSIS,
  P_CANNOT_SET_DATE_FOR_COMPLETED_ANALYSIS,
  P_ANALYSIS_CANNOT_BE_COMPLETED,
  P_ANALYSIS_ALREADY_COMPLETED,
  P_ANALYSIS_CANNOT_BE_UNDONE,
  P_ANALYSIS_NOT_COMPLETED,
  P_STANDARDS_CANNOT_BE_UPDATED,
  P_STANDARDS_ALREADY_UPDATED,
  P_ALL_ACTIONS_MUST_BE_VERIFIED,
  P_STANDARDS_NOT_UPDATED,
  P_CANNOT_SET_EXECUTOR_FOR_COMPLETED_STANDARDS,
  P_CANNOT_SET_DATE_FOR_COMPLETED_STANDARDS,
  P_AT_LEAST_ONE_ACTION_MUST_BE_CREATED,
  P_CANNOT_SET_COMPLETED_BY_FOR_INCOMPLETE_STANDARDS,
  P_CANNOT_SET_COMPLETED_DATE_FOR_INCOMPLETE_STANDARDS,
  P_CANNOT_SET_COMPLETION_COMMENTS_FOR_INCOMPLETE_STANDARDS,
  P_CANNOT_SET_COMPLETED_BY_FOR_INCOMPLETE_ANALYSIS,
  P_CANNOT_SET_COMPLETED_DATE_FOR_INCOMPLETE_ANALYSIS,
  P_CANNOT_SET_COMPLETION_COMMENTS_FOR_INCOMPLETE_ANALYSIS,
} from '../errors';
import { checkAndThrow } from '/imports/api/helpers';
import { Actions } from '/imports/share/collections/actions';
import { isOrgOwner } from '../checkers';

export const P_IsAnalysisOwner = (userId, organizationId, {
  status,
  ownerId,
} = {}) => (status === 1) && ownerId && _.some([
  isOrgOwner(userId, organizationId),
  Object.is(userId, ownerId),
]);

export const P_EnsureIsAnalysisOwner = (userId, organizationId, doc = {}) => {
  const predicate = !P_IsAnalysisOwner(userId, organizationId, doc);

  checkAndThrow(predicate, ONLY_OWNER_CAN_CHANGE);

  return doc;
};

export const P_IsExecutor = ({ userId } = {}, responsibleId) => {
  return Object.is(userId, responsibleId);
};

export const P_OnSetAnalysisExecutorChecker = ({ ...args }, doc) => {
  checkAndThrow(doc.isAnalysisCompleted(), P_CANNOT_SET_EXECUTOR_FOR_COMPLETED_ANALYSIS);

  return doc;
};

export const P_OnSetAnalysisDateChecker = ({ ...args }, doc) => {
  checkAndThrow(doc.isAnalysisCompleted(), P_CANNOT_SET_DATE_FOR_COMPLETED_ANALYSIS);

  return doc;
};

export const P_OnCompleteAnalysisChecker = ({ userId }, doc) => {
  checkAndThrow(!P_IsExecutor({ userId }, doc.ownerId), P_ANALYSIS_CANNOT_BE_COMPLETED);

  checkAndThrow(doc.isAnalysisCompleted(), P_ANALYSIS_ALREADY_COMPLETED);

  return doc;
};

export const P_OnUndoAnalysisChecker = ({ userId }, doc) => {
  checkAndThrow(!doc.isAnalysisCompleted(), P_ANALYSIS_NOT_COMPLETED);

  checkAndThrow(doc.areStandardsUpdated(), P_ANALYSIS_CANNOT_BE_UNDONE);

  P_EnsureIsAnalysisOwner(userId, doc.organizationId, doc.analysis);

  return doc;
};

export const P_OnSetAnalysisCompletedByChecker = ({ userId }, doc) => {
  checkAndThrow(!doc.isAnalysisCompleted(), P_CANNOT_SET_COMPLETED_BY_FOR_INCOMPLETE_ANALYSIS);

  P_EnsureIsAnalysisOwner(userId, doc.organizationId, doc.analysis);

  return doc
};

export const P_OnSetAnalysisCompletedDateChecker = ({ userId }, doc) => {
  P_EnsureIsAnalysisOwner(userId, doc.organizationId, doc.analysis);

  checkAndThrow(!doc.isAnalysisCompleted(), P_CANNOT_SET_COMPLETED_DATE_FOR_INCOMPLETE_ANALYSIS);

  return doc;
};

export const P_OnSetAnalysisCommentsChecker = ({ userId }, doc) => {
  P_EnsureIsAnalysisOwner(userId, doc.organizationId, doc.analysis);

  checkAndThrow(!doc.isAnalysisCompleted(), P_CANNOT_SET_COMPLETION_COMMENTS_FOR_INCOMPLETE_ANALYSIS);

  return doc;
};

export const P_OnStandardsUpdateChecker = ({ userId }, doc) => {
  checkAndThrow(!P_IsExecutor({ userId }, doc.originatorId), P_STANDARDS_CANNOT_BE_UPDATED);

  checkAndThrow(doc.areStandardsUpdated(), P_STANDARDS_ALREADY_UPDATED);

  const actionsCount = ((() => {
    const query = {
      'linkedTo.documentId': doc._id,
      isDeleted: { $in: [null, false] }
    };

    const actions = Actions.find(query);

    const count = actions.count();

    checkAndThrow(!count, P_AT_LEAST_ONE_ACTION_MUST_BE_CREATED);

    return count;
  })());

  const verifiedCount = ((() => {
    const query = {
      'linkedTo.documentId': doc._id,
      isDeleted: { $in: [null, false] },
      isVerified: true,
      isVerifiedAsEffective: true,
      verifiedAt: { $exists: true },
      verifiedBy: { $exists: true }
    };

    const actions = Actions.find(query);

    const count = actions.count();

    return count;
  })());

  checkAndThrow(!Object.is(actionsCount, verifiedCount), P_ALL_ACTIONS_MUST_BE_VERIFIED);

  return doc;
};

export const P_OnUndoStandardsUpdateChecker = ({ userId }, doc) => {
  P_EnsureIsAnalysisOwner(userId, doc.organizationId, doc.updateOfStandards);

  checkAndThrow(!doc.areStandardsUpdated(), P_STANDARDS_NOT_UPDATED);

  return doc;
};

export const P_OnSetStandardsUpdateExecutorChecker = ({ ...args }, doc) => {
  checkAndThrow(doc.areStandardsUpdated(), P_CANNOT_SET_EXECUTOR_FOR_COMPLETED_STANDARDS);

  return doc;
};

export const P_OnSetStandardsUpdateDateChecker = ({ ...args }, doc) => {
  checkAndThrow(doc.areStandardsUpdated(), P_CANNOT_SET_DATE_FOR_COMPLETED_STANDARDS);

  return doc;
};

export const P_OnSetStandardsUpdateCompletedByChecker = ({ userId }, doc) => {
  P_EnsureIsAnalysisOwner(userId, doc.organizationId, doc.updateOfStandards);

  checkAndThrow(!doc.areStandardsUpdated(), P_CANNOT_SET_COMPLETED_BY_FOR_INCOMPLETE_STANDARDS);

  return doc
};

export const P_OnSetStandardsUpdateCompletedDateChecker = ({ userId }, doc) => {
  P_EnsureIsAnalysisOwner(userId, doc.organizationId, doc.updateOfStandards);

  checkAndThrow(!doc.areStandardsUpdated(), P_CANNOT_SET_COMPLETED_DATE_FOR_INCOMPLETE_STANDARDS);

  return doc;
};

export const P_OnSetStandardsUpdateCommentsChecker = ({ userId }, doc) => {
  P_EnsureIsAnalysisOwner(userId, doc.organizationId, doc.updateOfStandards);

  checkAndThrow(!doc.areStandardsUpdated(), P_CANNOT_SET_COMPLETION_COMMENTS_FOR_INCOMPLETE_STANDARDS);

  return doc;
};
