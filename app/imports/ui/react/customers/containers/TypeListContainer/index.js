import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import { initCustomerTypes, createTypeItem, handleCustomersRedirectAndOpen } from '../../helpers';
import TypeList from '../../components/TypeList';
import propTypes from './propTypes';
import { getState } from '/imports/client/store';

const redirectAndOpen = ({ types, organizationsByIds, ...props }) => handleCustomersRedirectAndOpen(
  compose(createTypeItem, property('customerType')),
  types,
  organizationsByIds,
  props,
);

const CustomersTypeListContainer = compose(
  withProps(initCustomerTypes),
  connect(),
  lifecycle({
    componentWillMount() {
      const { organizationsByIds } = getState('collections');

      redirectAndOpen({ ...this.props, organizationsByIds });
    },
  }),
)(TypeList);

CustomersTypeListContainer.propTypes = propTypes;

export default CustomersTypeListContainer;
