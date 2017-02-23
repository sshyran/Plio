import { ProblemsStatuses } from '/imports/share/constants.js';
import { getProblemStatusColor } from '/imports/api/problems/helpers';

export default {
  getStatusName(status) {
    return ProblemsStatuses[status];
  },
  getShortStatusName(status) {
    switch (status) {
      case 4:
        return 'awaiting analysis';
      case 11:
        return 'awaiting update of standard(s)';
      default:
        return '';
    }
  },
  getClassByStatus(status) {
    const cssClasses = {
      amber: 'warning',
      green: 'success',
      red: 'danger',
    };

    return cssClasses[getProblemStatusColor(status)] || 'default';
  },
};
