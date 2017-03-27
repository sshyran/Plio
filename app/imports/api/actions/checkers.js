import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { Actions } from '/imports/share/collections/actions';
import { ProblemTypes, ActionTypes, WorkflowTypes } from '/imports/share/constants';
import { AnalysisTitles } from '../constants';
import { checkAndThrow } from '../helpers';
import { capitalize } from '/imports/share/helpers';

import { checkDocAndMembership, checkDocAndMembershipAndMore } from '../checkers';
import {
  INVALID_DOC_TYPE,
  DOC_NOT_FOUND,
  ONLY_OWNER_CAN_DELETE,
  ONLY_OWNER_CAN_RESTORE,
  ONLY_ORG_OWNER_CAN_RESTORE,
  ACT_RK_CANNOT_BE_LINKED_TO_NC,
  ACT_PA_CANNOT_BE_LINKED_TO_RISK,
  ACT_ALREADY_LINKED,
  ACT_CANNOT_COMPLETE,
  ACT_COMPLETION_CANNOT_BE_UNDONE,
  ACT_CANNOT_VERIFY,
  ACT_VERIFICATION_CANNOT_BE_UNDONE,
  ACT_ANALYSIS_MUST_BE_COMPLETED
} from '../errors';

export const ACT_Check = function ACT_Check(_id) {
  return checkDocAndMembership(Actions, _id, this.userId);
};

export const ACT_CheckEverything = function ACT_CheckEverything(_id) {
  return checkDocAndMembershipAndMore(Actions, _id, this.userId);
};

export const ACT_LinkedDocsChecker = (linkedTo) => {
  const linkedToByType = _.groupBy(linkedTo, doc => doc.documentType);

  const NCsIds = _.pluck(linkedToByType[ProblemTypes.NON_CONFORMITY], 'documentId');
  const risksIds = _.pluck(linkedToByType[ProblemTypes.RISK], 'documentId');

  let docWithUncompletedAnalysis, analysisTitle;

  docWithUncompletedAnalysis = Risks.findOne({
    _id: { $in: risksIds },
    workflowType: WorkflowTypes.SIX_STEP,
    'analysis.status': 0 // Not completed
  });

  if (docWithUncompletedAnalysis) {
    analysisTitle = AnalysisTitles.riskAnalysis;
  } else {
    docWithUncompletedAnalysis = NonConformities.findOne({
      _id: { $in: NCsIds },
      workflowType: WorkflowTypes.SIX_STEP,
      'analysis.status': 0 // Not completed
    });
    analysisTitle = AnalysisTitles.rootCauseAnalysis;
  }



  if (docWithUncompletedAnalysis) {
    const { sequentialId, title } = docWithUncompletedAnalysis;

    analysisTitle = capitalize(analysisTitle.replace('Complete ', ''));

    throw ACT_ANALYSIS_MUST_BE_COMPLETED(title, sequentialId, analysisTitle);
  }
};


export const ACT_OnLinkChecker = ({ documentId, documentType }, action) => {
  const collection = ((() => {
    if (Object.is(documentType, ProblemTypes.NON_CONFORMITY)) {
      if (Object.is(action.type, ActionTypes.RISK_CONTROL)) {
        throw ACT_RK_CANNOT_BE_LINKED_TO_NC;
      }

      return NonConformities;
    } else if (Object.is(documentType, ProblemTypes.RISK)) {
      return Risks;
    }
  })());

  checkAndThrow(!collection, INVALID_DOC_TYPE);

  const doc = collection.findOne({ _id: documentId });

  checkAndThrow(!doc, DOC_NOT_FOUND);

  checkAndThrow(action.isLinkedToDocument(), ACT_ALREADY_LINKED);

  ACT_LinkedDocsChecker([{ documentId, documentType }]);

  return {
    doc,
    collection,
    action
  };
};

export const ACT_OnCompleteChecker = ({ userId }, action) => {
  checkAndThrow(userId !== action.ownerId, ACT_CANNOT_COMPLETE);

  checkAndThrow(!action.canBeCompleted(), ACT_CANNOT_COMPLETE);

  return { action };
};

export const ACT_OnUndoCompletionChecker = ({ userId }, action) => {
  checkAndThrow(userId !== action.ownerId, ACT_COMPLETION_CANNOT_BE_UNDONE);

  checkAndThrow(!action.canCompletionBeUndone(), ACT_COMPLETION_CANNOT_BE_UNDONE);

  return { action };
};

export const ACT_OnVerifyChecker = ({ userId }, action) => {
  checkAndThrow(userId !== action.ownerId, ACT_CANNOT_VERIFY);

  checkAndThrow(!action.canBeVerified(), ACT_CANNOT_VERIFY);

  return { action };
};

export const ACT_OnUndoVerificationChecker = ({ userId }, action) => {
  checkAndThrow(!Object.is(userId, action.verifiedBy), ACT_VERIFICATION_CANNOT_BE_UNDONE);

  checkAndThrow(!action.canVerificationBeUndone(), ACT_VERIFICATION_CANNOT_BE_UNDONE);

  return { action };
};
