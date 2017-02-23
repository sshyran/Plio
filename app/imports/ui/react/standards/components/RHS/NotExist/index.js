import React from 'react';

import RHS from '../../../../components/RHS';

const StandardsRHSNotExist = () => (
  <RHS flex>
    <RHS.Card className="document-details">
      <div className="card-block card-heading">
        <h5>This standard no longer exists in Plio</h5>
      </div>
    </RHS.Card>
  </RHS>
);

export default StandardsRHSNotExist;
