import { Meteor } from 'meteor/meteor';

export const getClassByStatus = (status) => {
  switch (status) {
    case 0:
      return 'default';
    case 1:
      return 'warning';
    case 2:
      return 'danger';
    case 3:
      return 'success';
    default:
      return 'default';
  }
};

export const getQueryParams = ({ isCompleted, assigneeId }, currentUserId) => {
  const assignee = assigneeId || currentUserId || Meteor.userId();
  return (userId) => {
    if (isCompleted) { // completed
      if (assignee === userId) {
        return { filter: 3 }; // My completed work
      }

      return { filter: 4 }; // Team completed work
    }

    if (assignee === userId) {
      return { filter: 1 }; // My current work
    }

    return { filter: 2 }; // Team current work
  };
};
