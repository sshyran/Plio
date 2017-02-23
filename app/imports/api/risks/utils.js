import property from 'lodash.property';

import { Risks } from '/imports/share/collections/risks';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { Files } from '/imports/share/collections/files';
import { createProblemsTree } from '../problems/utils';
import { getLessonsCursorByDocumentId } from '../lessons/utils';
import { getStandardsCursorByIds } from '../standards/utils';
import { toObjFind, compose, transsoc, toDocIdAndType, mapC, assoc } from '../helpers';
import { DocumentTypes } from '/imports/share/constants';
import { Reviews } from '/imports/share/collections/reviews';

export const getRiskFiles = ({
  fileIds = [],
  improvementPlan: {
    fileIds: IPFileIds = [],
  } = {},
}) => {
  const ids = fileIds.concat(IPFileIds);

  return Files.find({ _id: { $in: ids } });
};

export const createRiskCardPublicationTree = (getQuery) => {
  const findRisks = compose(Risks.find.bind(Risks), getQuery);
  const tree = createProblemsTree(findRisks);
  const cursorGetters = [
    getRiskFiles,
    getLessonsCursorByDocumentId,
    getStandardsCursorByIds({ title: 1 }),
    compose(RiskTypes.find.bind(RiskTypes), transsoc({ _id: property('typeId') })),
    compose(Reviews.find.bind(Reviews), toDocIdAndType(DocumentTypes.RISK)),
  ];
  const children = [...tree.children, ...mapC(toObjFind, cursorGetters)];
  const publishTree = assoc('children', children, tree);

  return publishTree;
};
