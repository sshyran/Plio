import { ActionTypes } from '/imports/share/constants';
import { equals } from '/imports/api/helpers';

export const getClassByStatus = (status) => {
  switch (status) {
    case 1:
    case 4:
      return 'yellow';
    case 8:
    case 9:
      return 'success';
    case 2:
    case 5:
      return 'warning';
    case 3:
    case 6:
    case 7:
      return 'danger';
    default:
      return 'default';
  }
};

export const splitActionsByType = (actions) => {
  const map = {
    [ActionTypes.CORRECTIVE_ACTION]: [],
    [ActionTypes.PREVENTATIVE_ACTION]: [],
    [ActionTypes.RISK_CONTROL]: [],
  };

  return actions.reduce((prev, cur) => {
    const key = Object.keys(prev).find(equals(cur.type));

    return key ? ({
      ...prev,
      [key]: [
        ...prev[key],
        cur,
      ],
    }) : ({ ...prev });
  }, map);
};
