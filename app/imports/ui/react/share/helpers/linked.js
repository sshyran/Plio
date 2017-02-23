import curry from 'lodash.curry';

import {
  propEq,
  find,
  every,
  reduceC,
  propEqDocId,
  propEqDocType,
  identity,
} from '/imports/api/helpers';
import { getQueryParams } from '/imports/api/work-items/helpers';
import { getPath } from '/imports/ui/utils/router';
import { getClassByStatus as getActionClassByStatus } from '/imports/api/actions/helpers';

export const getLinkedActions = curry((predicate, { userId, workItems }, actions) =>
  reduceC((prev, action) => {
    if (typeof predicate === 'function' && !predicate(action)) return prev;

    const workItem = find(propEq('linkedDoc._id', action._id), workItems);
    const href = ((() => {
      if (!workItem) return '#';

      const params = { workItemId: workItem._id };
      const queryParams = getQueryParams(workItem)(userId);

      return getPath('workInboxItem')(params, queryParams);
    })());
    const result = {
      ...action,
      href,
      indicator: getActionClassByStatus(action.status),
    };

    return prev.concat(result);
  }, [], actions));

const getLinkedByDocIdType = curry((mapper, docId, docType, array) => {
  const pred = every([propEqDocId(docId), propEqDocType(docType)]);

  const reducer = (acc, item) => {
    if (pred(item)) return acc.concat(mapper(item));

    return acc;
  };

  return reduceC(reducer, [], array);
});

export const getLinkedLessons = getLinkedByDocIdType(lesson => ({
  ...lesson,
  sequentialId: `LL${lesson.serialNumber}`,
}));

export const getLinkedReviews = getLinkedByDocIdType(identity);
