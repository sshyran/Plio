import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, shouldUpdate } from 'recompose';
import { _ } from 'meteor/underscore';

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
import { getStandardsByFilter } from '../../helpers';
import {
  sortArrayByTitlePrefix,
  getSearchMatchText,
  combineObjects,
  pickFrom,
  equals,
  pickC,
  filterC,
  includes,
} from '/imports/api/helpers';
import { onToggleCollapse } from '/imports/ui/react/share/LHS/handlers';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';

const mapStateToProps = combineObjects([
  pickFrom('standards', ['standardsFiltered']),
  pickFrom('collections', ['standards', 'standardsByIds']),
  pickFrom('global', ['searchText', 'filter', 'animating', 'urlItemId', 'userId']),
  pickFrom('organizations', ['organizationId']),
  pickFrom('dataImport', ['isModalOpened']),
]);

const pickComparableProps = pickC(['_id', 'sectionId', 'typeId', 'isDeleted']);

export default compose(
  connect(mapStateToProps),
  shouldUpdate((props, nextProps) => !!(
    props.searchText !== nextProps.searchText ||
    props.filter !== nextProps.filter ||
    props.animating !== nextProps.animating ||
    props.standards.length !== nextProps.standards.length ||
    props.isModalOpened !== nextProps.isModalOpened ||
    !equals(
      pickComparableProps(props.standardsByIds[props.urlItemId]),
      pickComparableProps(nextProps.standardsByIds[nextProps.urlItemId])
    )
  )),
  mapProps(({ isModalOpened: isDataImportModalOpened, ...props }) => {
    const filteredStandards = getStandardsByFilter({
      standards: props.standards,
      filter: props.filter,
    });

    let standards = props.searchText
      ? filterC(std => includes(std._id, props.standardsFiltered), filteredStandards)
      : filteredStandards;

    if (props.filter !== STANDARD_FILTER_MAP.DELETED) standards = sortArrayByTitlePrefix(standards);
    else standards = _.sortBy(standards, 'deletedAt').reverse();

    const searchResultsText = getSearchMatchText(props.searchText, standards.length);

    return {
      ...props,
      standards,
      searchResultsText,
      isDataImportModalOpened,
      filteredStandards,
    };
  }),
  withHandlers({
    onToggleCollapse,
    onClear,
    onModalOpen,
    getDocsCount,
    onDataImportSuccess,
    onDataImportModalClose,
    openDocumentCreationModal,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
)(StandardsLHS);
