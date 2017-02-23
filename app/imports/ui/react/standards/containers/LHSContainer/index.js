import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, shouldUpdate } from 'recompose';

import StandardsLHS from '../../components/LHS';
import {
  onSearchTextChange,
  onClear,
  onModalOpen,
  onDataImportSuccess,
  getDocsCount,
  onDataImportModalClose,
  openDocumentCreationModal,
} from './handlers';
import {
  getSearchMatchText,
  combineObjects,
  pickFrom,
  equals,
  pickC,
  filterC,
  includes,
  cond,
  always,
  identity,
} from '/imports/api/helpers';
import { onToggleCollapse } from '/imports/ui/react/share/LHS/handlers';

const mapStateToProps = combineObjects([
  pickFrom('standards', ['standardsFiltered']),
  pickFrom('collections', ['standards', 'standardsByIds']),
  pickFrom('global', ['searchText', 'filter', 'animating', 'urlItemId', 'userId']),
  pickFrom('organizations', ['organizationId']),
  pickFrom('dataImport', ['isModalOpened']),
  pickFrom('entities.standards', ['entities', 'allIds']),
]);

const pickComparableProps = pickC(['_id', 'sectionId', 'typeId', 'isDeleted']);

const shouldUpdatePred = (props, nextProps) => !!(
  props.searchText !== nextProps.searchText ||
  props.filter !== nextProps.filter ||
  props.animating !== nextProps.animating ||
  props.isModalOpened !== nextProps.isModalOpened ||
  props.allIds.length !== nextProps.allIds.length ||
  !equals(
    pickComparableProps(props.entities[props.urlItemId]),
    pickComparableProps(nextProps.entities[nextProps.urlItemId])
  )
);

const propsMapper = ({ isModalOpened: isDataImportModalOpened, ...props }) => {
  const getIds = cond(
    always(props.searchText),
    filterC(id => includes(id, props.standardsFiltered)),
    identity
  );
  const standardIds = getIds(props.allIds);
  const searchResultsText = getSearchMatchText(props.searchText, standardIds.length);

  return {
    ...props,
    searchResultsText,
    isDataImportModalOpened,
    standardIds,
  };
};

const handlers = {
  onToggleCollapse,
  onClear,
  onModalOpen,
  getDocsCount,
  onDataImportSuccess,
  onDataImportModalClose,
  openDocumentCreationModal,
  onSearchTextChange: props => e => onSearchTextChange(props, e.target),
};

export default compose(
  connect(mapStateToProps),
  shouldUpdate(shouldUpdatePred),
  mapProps(propsMapper),
  withHandlers(handlers),
)(StandardsLHS);
