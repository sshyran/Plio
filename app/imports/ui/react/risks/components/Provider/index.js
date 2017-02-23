import React from 'react';
import { Provider } from 'react-redux';

import store from '/imports/client/store';
import RisksLayoutContainer from '../../containers/RisksLayoutContainer';

const RisksProvider = (props) => (
  <Provider store={store}>
    <RisksLayoutContainer {...props} />
  </Provider>
);

export default RisksProvider;
 
