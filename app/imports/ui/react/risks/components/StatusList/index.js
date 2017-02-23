import React, { PropTypes } from 'react';

import StatusListItem from '../StatusListItem';

const StatusList = ({ statuses, onToggleCollapse }) => (
  <div>
    {statuses.map(status => (
      <StatusListItem key={status.value} {...{ status, onToggleCollapse }} />
    ))}
  </div>
);

StatusList.propTypes = {
  statuses: PropTypes.array.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default StatusList;
