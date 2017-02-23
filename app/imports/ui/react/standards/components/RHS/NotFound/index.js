import React from 'react';

import propTypes from './propTypes';
import RHS from '../../../../components/RHS';

const StandardsRHSNotFound = ({ filter }) => {
  let text;

  switch (filter) {
    case 3:
      text = 'There are no deleted standards yet!';
      break;
    default:
      text = 'There are no standards yet! Click on the "Add" button to create your first standard.';
  }

  return (
    <RHS flex>
      <RHS.Card className="document-details">
        <div className="card-block card-heading">
          <h5>{text}</h5>
        </div>
      </RHS.Card>
    </RHS>
  );
};

StandardsRHSNotFound.propTypes = propTypes;

export default StandardsRHSNotFound;
