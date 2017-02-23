import React from 'react';

import RHS from '../../../components/RHS';
import propTypes from './propTypes';

const HelpDocsRHSNotFound = (props) => {
  let text = 'There are no help documents yet!';
  if (props.userHasChangeAccess) {
    text = `${text} Click on the "Add" button to create your first help document.`;
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

HelpDocsRHSNotFound.propTypes = propTypes;

export default HelpDocsRHSNotFound;
