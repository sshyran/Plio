import { _ } from 'meteor/underscore';
import property from 'lodash.property';

import { TYPE_UNCATEGORIZED, RISK_STATUSES } from './constants';
import { CollectionNames } from '/imports/share/constants';
import { RiskFilterIndexes, DEPARTMENT_UNCATEGORIZED } from '/imports/api/constants';
import {
  compose,
  find,
  propEqId,
  propId,
  propEq,
  getC,
  notDeleted,
  getId,
  pickDeep,
  includes,
  some,
  every,
  filterC,
  propEqType,
  mapC,
  not,
  propEqKey,
  length,
} from '/imports/api/helpers';
import {
  addCollapsed,
  chainActions,
  addCollapsedWithClose,
} from '/imports/client/store/actions/globalActions';
import { goTo } from '../../utils/router/actions';
import store, { getState } from '/imports/client/store';
import {
  createTypeItem,
  getListData,
  handleRedirectAndOpen,
  withRedirectAndOpen,
} from '../helpers';
import { problemsStatuses } from '../problems/constants';

export const goToRisk = goTo('risk');
export const goToRisks = goTo('risks');

export const createRiskTypeItem = createTypeItem(CollectionNames.RISK_TYPES);
export const createRiskDepartmentItem = createTypeItem(CollectionNames.DEPARTMENTS);
export const createRiskStatusItem = createTypeItem(RISK_STATUSES);

export const getRisksByFilter = ({ filter, risks }) => (
  filter === RiskFilterIndexes.DELETED
    ? risks.filter(propEq('isDeleted', true))
    : risks.filter(notDeleted)
);

const addCollapsedItem = (...fns) => closeOthers => {
  let fn = addCollapsed;

  if (closeOthers) {
    if (typeof closeOthers === 'function') fn = addCollapsedWithClose(closeOthers);
    else fn = addCollapsedWithClose(null);
  }

  return compose(fn, ...fns);
};
export const addCollapsedType = addCollapsedItem(createRiskTypeItem, propId);
export const addCollapsedStatus = addCollapsedItem(createRiskStatusItem, property('value'));
export const addCollapsedDepartment = addCollapsedItem(createRiskDepartmentItem, propId);

export const createUncategorizedType = ({ risks = [], types = [] }) => ({
  _id: TYPE_UNCATEGORIZED,
  title: 'Uncategorized',
  organizationId: getC('organizationId', risks[0]),
  risks: risks.filter(risk => !find(propEqId(risk.typeId), types)),
});

export const createUncategorizedDepartment = ({ risks = [], departments = [] }) => ({
  _id: DEPARTMENT_UNCATEGORIZED,
  name: 'Uncategorized',
  organizationId: getC('organizationId', risks[0]),
  risks: risks.filter(risk => !find(
    department => _.contains(risk.departmentsIds, department._id),
    departments
  )),
});

export const getRiskListData = getListData('risks');

export const handleRisksRedirectAndOpen = handleRedirectAndOpen(
  getRiskListData,
  goToRisk,
  goToRisks
);

export const withRisksRedirectAndOpen = withRedirectAndOpen(
  (props, nextProps) => (!props.isSelectedRiskDeleted && nextProps.isSelectedRiskDeleted) ||
    (nextProps.searchText && nextProps.risksFiltered.length) ||
    !props.areDepsReady && nextProps.areDepsReady,
  pickDeep([
    'global.searchText',
    'risks.risksFiltered',
    'collections.risksByIds',
    'risks.areDepsReady',
  ]),
);

const notCollapsed = collapsed => key => compose(not, find(propEqKey(key)))(collapsed);

const getExpandedFiltered = (prop, predicate, collapsed, items) => filterC(every([
  compose(notCollapsed(collapsed), property(prop)),
  obj => compose(length, filterC(predicate(obj)))(items),
]));

export const expandCollapsedTypes = (risks, types, closeOthers) => {
  const { collapsed } = getState('global');
  const uncategorizedType = createUncategorizedType({ risks, types });
  const predicate = compose(propEq('typeId'), property('_id'));
  const getTypes = getExpandedFiltered('_id', predicate, collapsed, risks);
  const typesFiltered = getTypes(types);
  const resultTypes = length(uncategorizedType.risks)
    ? typesFiltered.concat(uncategorizedType)
    : typesFiltered;
  const actions = mapC(addCollapsedType(closeOthers), resultTypes);

  return store.dispatch(chainActions(actions));
};

export const expandCollapsedStatuses = (risks, statuses, closeOthers) => {
  const { collapsed } = getState('global');
  const predicate = compose(propEq('status'), property('value'));
  const getStatuses = getExpandedFiltered('value', predicate, collapsed, risks);
  const statusesFiltered = getStatuses(statuses);
  const actions = mapC(addCollapsedStatus(closeOthers), statusesFiltered);

  return store.dispatch(chainActions(actions));
};

export const expandCollapsedDepartments = (risks, departments, closeOthers) => {
  const { collapsed } = getState('global');
  const predicate = ({ _id }) => compose(includes(_id), property('departmentsIds'));
  const getDepartments = getExpandedFiltered('_id', predicate, collapsed, risks);
  const departmentsFiltered = getDepartments(departments);
  const uncategorizedDepartment = createUncategorizedDepartment({ departments, risks });
  const resultDepartments = length(uncategorizedDepartment.risks)
    ? departmentsFiltered.concat(uncategorizedDepartment)
    : departmentsFiltered;
  const actions = mapC(addCollapsedDepartment(closeOthers), resultDepartments);

  return store.dispatch(chainActions(actions));
};

export const expandCollapsedRisks = (ids, closeOthers = false) => {
  const _ids = typeof ids === 'string' ? [ids] : ids;
  const {
    collections: { risks, riskTypes, departments },
    global: { filter },
  } = getState();
  const risksFound = filterC(risk => includes(risk._id, _ids), risks);

  switch (filter) {
    case RiskFilterIndexes.TYPE:
      return expandCollapsedTypes(risksFound, riskTypes, closeOthers);
    case RiskFilterIndexes.STATUS:
      return expandCollapsedStatuses(risksFound, problemsStatuses, closeOthers);
    case RiskFilterIndexes.DEPARTMENT:
      return expandCollapsedDepartments(risksFound, departments, closeOthers);
    default:
      return false;
  }
};

export const collapseExpandedTypes = (typeId) => {
  const { riskTypesByIds = {} } = getState('collections');
  // collapse all types except the one that is holding selected risk
  const id = getId(riskTypesByIds[typeId]) || TYPE_UNCATEGORIZED;
  const item = createRiskTypeItem(id);
  const typeCollapseAction = addCollapsedWithClose(null, item);

  return store.dispatch(typeCollapseAction);
};

export const collapseExpandedStatuses = (status) => {
  const item = createRiskStatusItem(status);
  const action = addCollapsedWithClose(null, item);

  return store.dispatch(action);
};

export const collapseExpandedDepartments = (ids) => {
  const { collapsed } = getState('global');
  const departments = ids.length ? ids : [DEPARTMENT_UNCATEGORIZED];
  const includesKey = ({ key }) => includes(key, departments);
  const expandedDepartments = filterC(every([
    includesKey,
    some([
      propEqType(CollectionNames.DEPARTMENTS),
      propEqType(DEPARTMENT_UNCATEGORIZED),
    ]),
  ]), collapsed);
  // close non-selected departments
  // item => collapsed[item] => Bool
  const close = ({ type }) => some([
    includesKey,
    compose(not, propEqType(type)),
  ]);

  const actions = mapC(addCollapsedWithClose(close), expandedDepartments);

  return store.dispatch(chainActions(actions));
};

export const collapseExpandedRisks = () => {
  // close all collapses except the selected one
  const {
    collections: { risksByIds },
    global: { filter, urlItemId },
  } = getState();
  const selectedRisk = risksByIds[urlItemId];

  if (!selectedRisk) return false;

  switch (filter) {
    case RiskFilterIndexes.TYPE:
      return collapseExpandedTypes(selectedRisk.typeId);
    case RiskFilterIndexes.STATUS:
      return collapseExpandedStatuses(selectedRisk.status);
    case RiskFilterIndexes.DEPARTMENT:
      return collapseExpandedDepartments(selectedRisk.departmentsIds);
    default:
      return false;
  }
};

export const getSelectedRiskDeletedState = state => ({
  isSelectedRiskDeleted: getC(
    'isDeleted',
    state.collections.risksByIds[state.global.urlItemId]
  ),
});
