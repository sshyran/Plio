import { _ } from 'meteor/underscore';
import property from 'lodash.property';

import { propEq, propEqKey, compose } from '/imports/api/helpers';
import { addCollapsed, chainActions } from '/imports/client/store/actions/globalActions';
import store, { getState } from '/imports/client/store';
import { CustomerTypes } from '/imports/share/constants';
import { handleRedirectAndOpen, getListData } from '../helpers';
import { goTo } from '../../utils/router/actions';

export const createTypeItem = key => ({
  key: `${key}`,
  type: 'CustomerType',
});

export const expandCollapsedCustomer = (_id) => {
  const { organizationsByIds } = getState('collections');
  const organization = organizationsByIds[_id];

  if (!organization) return false;

  const typeItem = createTypeItem(organization.customerType);

  return store.dispatch(addCollapsed({ ...typeItem, close: { type: typeItem.type } }));
};

export const expandCollapsedCustomers = (ids) => {
  const {
    collections: { organizations },
    global: { collapsed },
  } = getState();

  const notCollapsed = key => !collapsed.find(propEqKey(key));
  const organizationsFound = organizations.filter(org => ids.includes(org._id));

  const types = [];

  _.each(CustomerTypes, (customerType) => {
    const shouldExpand = notCollapsed(customerType) &&
      organizationsFound.filter(propEq('customerType', customerType)).length;

    if (shouldExpand) {
      types.push(customerType);
    }
  });

  const actions = types.map((customerType) => {
    const typeItem = createTypeItem(customerType);
    return addCollapsed({ ...typeItem });
  });

  return store.dispatch(chainActions(actions));
};

export const collapseExpandedCustomers = () => {
  const {
    collections: { organizationsByIds },
    global: { urlItemId },
  } = getState();
  const selectedOrg = organizationsByIds[urlItemId];
  if (!selectedOrg) {
    return false;
  }

  const selectedType = selectedOrg.customerType;
  const typeItem = createTypeItem(selectedType);
  const typeCollapseAction = addCollapsed({
    ...typeItem,
    close: { type: typeItem.type },
  });

  return store.dispatch(typeCollapseAction);
};

export const initCustomerTypes = (props) => {
  const types = _.values(CustomerTypes).reduce((prev, customerType) => {
    const organizations = Object.assign([], props.organizations).filter(
      propEq('customerType', customerType)
    );

    return organizations.length
      ? prev.concat({ customerType, organizations })
      : prev;
  }, []);

  return { types };
};

export const getCustomerListData = getListData('organizations');

export const goToCustomer = goTo('customer');
export const goToCustomers = goTo('customers');

export const handleCustomersRedirectAndOpen = handleRedirectAndOpen(
  getCustomerListData,
  goToCustomer,
  goToCustomers,
);
