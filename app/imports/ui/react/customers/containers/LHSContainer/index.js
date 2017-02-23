import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, shouldUpdate } from 'recompose';

import {
  onSearchTextChange,
  onClear,
} from './handlers';
import { onToggleCollapse } from '/imports/ui/react/share/LHS/handlers';
import { pickDeep, notEquals, getSearchMatchText } from '/imports/api/helpers';
import CustomersLHS from '../../components/LHS';

export default compose(
  connect(pickDeep([
    'global.animating',
    'global.searchText',
    'global.urlItemId',
    'collections.organizations',
    'customers.organizationsFiltered',
  ])),

  shouldUpdate((props, nextProps) => !!(
    props.searchText !== nextProps.searchText ||
    props.animating !== nextProps.animating ||
    props.organizationsFiltered !== nextProps.organizationsFiltered ||
    notEquals(props.organizations, nextProps.organizations)
  )),

  withHandlers({
    onToggleCollapse,
    onClear,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),

  mapProps((props) => {
    const organizations = props.searchText
      ? props.organizations.filter(org => props.organizationsFiltered.includes(org._id))
      : props.organizations;

    const searchResultsText = getSearchMatchText(props.searchText, organizations.length);

    return {
      ...props,
      organizations,
      searchResultsText,
    };
  }),
)(CustomersLHS);
