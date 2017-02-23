import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import property from 'lodash.property';
import set from 'lodash.set';

import {
  combineObjects,
  pickFrom,
  pickDocuments,
  mapC,
  transsoc,
  propValue,
  every,
  notDeleted,
  propEq,
  find,
  filterC,
  getC,
} from '/imports/api/helpers';
import { capitalize, getFormattedDate } from '/imports/share/helpers';
import { getNameByScore, getClassByScore } from '/imports/api/risks/helpers';
import {
  getLinkedActions,
  getLinkedLessons,
} from '/imports/ui/react/share/helpers/linked';
import { DocumentTypes, ActionTypes } from '/imports/share/constants';
import { splitActionsByType } from '/imports/api/actions/helpers';
import { getPath } from '/imports/ui/utils/router';

import BodyContents from '../../components/RHS/Body';

const mapStateToProps = combineObjects([
  pickFrom('global', ['userId', 'urlItemId']),
  pickFrom('organizations', ['orgSerialNumber']),
  pickFrom('collections', [
    'usersByIds',
    'departmentsByIds',
    'standardsByIds',
    'riskTypesByIds',
    'workItems',
    'lessons',
    'actions',
  ]),
]);

const propsMapper = ({
  risk,
  usersByIds,
  riskTypesByIds,
  departmentsByIds,
  standardsByIds,
  ...props
}) => {
  const pickUsers = pickDocuments(['_id', 'profile', 'emails'], usersByIds);
  const predicate = every([
    notDeleted,
    compose(
      find(propEq('documentId', risk._id)),
      property('linkedTo')
    ),
  ]);
  const linkedActions = getLinkedActions(predicate, props, props.actions);
  const actionsByType = splitActionsByType(linkedActions);
  const preventativeActions = actionsByType[ActionTypes.PREVENTATIVE_ACTION];
  const correctiveActions = actionsByType[ActionTypes.CORRECTIVE_ACTION];
  const type = riskTypesByIds[risk.typeId];
  const lessons = getLinkedLessons(risk._id, DocumentTypes.RISK, props.lessons);
  const magnitude = risk.magnitude && capitalize(risk.magnitude);
  const scores = mapC(transsoc({
    scoreTypeId: compose(capitalize, property('scoreTypeId')),
    scoredBy: compose(pickUsers, property('scoredBy')),
    scoredAt: compose(getFormattedDate, property('scoredAt')),
    priority: compose(getNameByScore, propValue),
    className: compose(getClassByScore, propValue),
    value: propValue,
  }), risk.scores);
  const identifiedAt = getFormattedDate(risk.identifiedAt);
  const departments = pickDocuments(['_id', 'name'], departmentsByIds, risk.departmentsIds);
  const standards = compose(
    mapC(s => ({ ...s, href: getPath('standard')({ urlItemId: s._id }) })),
    filterC(notDeleted),
    pickDocuments(['_id', 'title'], standardsByIds),
  )(risk.standardsIds);

  const setUsers = () => [
    'identifiedBy',
    'notify',
    'improvementPlan.owner',
    'analysis.executor',
    'analysis.completedBy',
    'updateOfStandards.executor',
    'updateOfStandards.completedBy',
  ].map(path => set(risk, path, pickUsers(getC(path, risk))));

  setUsers();

  return {
    ...props,
    ...risk,
    type,
    preventativeActions,
    correctiveActions,
    magnitude,
    scores,
    identifiedAt,
    departments,
    standards,
    lessons,
  };
};

export default compose(
  connect(mapStateToProps),
  mapProps(propsMapper),
)(BodyContents);
