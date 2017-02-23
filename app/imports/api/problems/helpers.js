export const getProblemStatusColor = (status) => {
  switch (status) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 6:
    case 7:
    case 8:
    case 9:
    case 11:
    case 12:
    case 13:
    case 15:
    case 16:
      return 'amber';
    case 5:
    case 10:
    case 14:
    case 17:
    case 18:
      return 'red';
    case 19:
    case 20:
      return 'green';
    default:
      return '';
  }
};

export const getClassByStatus = (status) => {
  const cssClasses = {
    amber: 'warning',
    green: 'success',
    red: 'danger',
  };

  return cssClasses[getProblemStatusColor(status)] || 'default';
};

export const compareStatusesByPriority = (() => {
  const getPriority = (status) => {
    const priorities = {
      red: 3,
      amber: 2,
      green: 1,
    };

    return priorities[getProblemStatusColor(status)] || 0;
  };

  return (status1, status2) => {
    const priority1 = getPriority(status1);
    const priority2 = getPriority(status2);

    if (priority1 !== priority2) {
      return priority2 - priority1;
    }

    return status2 - status1;
  };
})();
