import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, onlyUpdateForKeys } from 'recompose';
import { _ } from 'meteor/underscore';

import RiskLHS from '../../components/LHS';
import {
  onSearchTextChange,
  onClear,
  onModalOpen,
} from './handlers';
import { getRisksByFilter } from '../../helpers';
import {
  sortArrayByTitlePrefix,
  pickC,
  getSearchMatchText,
} from '/imports/api/helpers';
import { onToggleCollapse } from '/imports/ui/react/share/LHS/handlers';
import { RiskFilterIndexes } from '/imports/api/constants';

const mapStateToProps = ({
  risks: { risksFiltered },
  collections: { risks },
  global: {
    searchText,
    filter,
    animating,
    urlItemId,
  },
}) => ({
  risksFiltered,
  searchText,
  filter,
  animating,
  urlItemId,
  risks,
});

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  mapProps(props => ({
    ...props,
    risks: props.risks.map(pickC([
      '_id',
      'departmentsIds',
      'typeId',
      'titlePrefix',
      'status',
      'isDeleted',
      'sequentialId',
      'deletedAt',
    ])),
  })),
  onlyUpdateForKeys(['searchText', 'filter', 'animating', 'risks']),
  withHandlers({
    onToggleCollapse,
    onClear,
    onModalOpen,
  }),
  mapProps((props) => {
    let risks = props.searchText
      ? props.risks.filter(risk => props.risksFiltered.includes(risk._id))
      : props.risks;
    risks = getRisksByFilter({ risks, filter: props.filter });
    const sortBy = props.searchText ? 'sequentialId' : 'deletedAt';

    if (props.filter !== RiskFilterIndexes.DELETED) {
      if (sortBy !== 'sequentialId') risks = sortArrayByTitlePrefix(risks);
      else risks = _.sortBy(risks, sortBy);
    } else {
      risks = _.sortBy(risks, sortBy);
      if (sortBy !== 'sequentialId') risks = risks.reverse();
    }

    const searchResultsText = getSearchMatchText(props.searchText, risks.length);
    return {
      ...props,
      risks,
      searchResultsText,
    };
  }),
)(RiskLHS);
