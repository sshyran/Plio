import { PropTypes } from 'react';

export default {
  organizations: PropTypes.arrayOf(PropTypes.object),
  onToggleCollapse: PropTypes.func,
};
