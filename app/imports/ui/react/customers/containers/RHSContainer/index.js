import {
  compose,
  branch,
  renderComponent,
  mapProps,
  onlyUpdateForKeys,
} from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import CustomersRHS from '../../components/RHS';
import { identity, pickC } from '/imports/api/helpers';

export default compose(
  connect(state => ({
    organizationsLength: state.collections.organizations.length,
  })),
  branch(
    property('organizationsLength'),
    identity,
    renderComponent(CustomersRHS.NotFound)
  ),
  connect(state => ({
    ...pickC(['isCardReady', 'urlItemId'], state.global),
    organization: state.collections.organizationsByIds[state.global.urlItemId],
  })),
  branch(
    props => props.isCardReady && props.urlItemId && !props.organization,
    renderComponent(CustomersRHS.NotExist),
    identity
  ),
  mapProps(({ isCardReady, organizationsLength, organization, ...props }) => ({
    ...props,
    organization,
    isReady: !!(isCardReady && organizationsLength && organization),
  })),
  onlyUpdateForKeys(['isReady', 'organization']),
)(CustomersRHS);
