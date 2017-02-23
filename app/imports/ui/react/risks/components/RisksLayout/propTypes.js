import { PropTypes } from 'react';

export default {
  filters: PropTypes.object.isRequired,
  filter: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  onHandleFilterChange: PropTypes.func,
  onHandleReturn: PropTypes.func,
};
