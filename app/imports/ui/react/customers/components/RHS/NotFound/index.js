import React from 'react';

import propTypes from './propTypes';
import RHS from '../../../../components/RHS';

const CustomersRHSNotFound = () => (
  <RHS flex>
    <RHS.Card className="document-details">
      <div className="card-block card-heading">
        <h5>There are no organizations yet</h5>
      </div>
    </RHS.Card>
  </RHS>
);

CustomersRHSNotFound.propTypes = propTypes;

export default CustomersRHSNotFound;
