import React from 'react';

import propTypes from './propTypes';
import RHS from '../../../../components/RHS';

const RisksRHSNotFound = ({ filter }) => {
  let text;

  switch (filter) {
    case 3:
      text = 'There are no deleted risks yet!';
      break;
    default:
      text = 'There are no risks yet! Click on the "Add" button to create your first risk.';
  }

  return (
    <RHS>
      <RHS.Card className="document-details">
        <div className="card-block card-heading">
          <h5>{text}</h5>
        </div>
      </RHS.Card>
    </RHS>
  );
};

RisksRHSNotFound.propTypes = propTypes;

export default RisksRHSNotFound;
