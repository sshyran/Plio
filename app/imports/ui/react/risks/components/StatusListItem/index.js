import React, { PropTypes } from 'react';

import createTypeItem from '../../../helpers/createTypeItem';
import LHSItemContainer from '../../../containers/LHSItemContainer';
import RisksListContainer from '../../containers/RisksListContainer';
import { RISK_STATUSES } from '../../constants';

const StatusListItem = ({ status, onToggleCollapse }) => (
  <LHSItemContainer
    {...{ onToggleCollapse }}
    item={createTypeItem(RISK_STATUSES, status.value)}
    lText={status.text}
    rText={status.indicator}
  >
    <div className="sub">
      <RisksListContainer risks={status.risks} />
    </div>
  </LHSItemContainer>
);

StatusListItem.propTypes = {
  status: PropTypes.object.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default StatusListItem;
