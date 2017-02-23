import React, { PropTypes } from 'react';
import { ListGroup } from 'reactstrap';

import RisksListItemContainer from '../../containers/RisksListItemContainer';

const RisksList = ({
  risks,
  section,
  orgSerialNumber,
  organization,
  userId,
  filter,
  urlItemId,
}) => (
  <ListGroup>
    {risks.map(risk => (
      <RisksListItemContainer
        key={risk._id}
        {...{ section, orgSerialNumber, organization, userId, filter, urlItemId, ...risk }}
      />
    ))}
  </ListGroup>
);

RisksList.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object),
  section: PropTypes.object,
  orgSerialNumber: PropTypes.number,
  organization: PropTypes.object,
  userId: PropTypes.string,
  filter: PropTypes.number,
  urlItemId: PropTypes.string,
};

export default RisksList;
