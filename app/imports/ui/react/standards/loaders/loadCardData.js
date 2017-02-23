import { batchActions } from 'redux-batched-actions';
import { Tracker } from 'meteor/tracker';

import { DocumentCardSubs } from '/imports/startup/client/subsmanagers';
import { setIsCardReady } from '/imports/client/store/actions/globalActions';
import { updateStandard, setReviews } from '/imports/client/store/actions/collectionsActions';
import { getState } from '/imports/client/store';
import { Standards } from '/imports/share/collections/standards';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import { DocumentTypes } from '/imports/share/constants';
import { Reviews } from '/imports/share/collections/reviews';
import { invokeReady } from '/imports/api/helpers';

const getReviews = (documentId) => {
  const query = { documentId, documentType: DocumentTypes.STANDARD };
  const options = { sort: { reviewedAt: -1 } };
  return Reviews.find(query, options).fetch();
};

export default function loadCardData({
  dispatch,
  organizationId,
  urlItemId,
  filter,
}, onData) {
  let subscription;
  let isCardReady = true;
  let actions = [];

  if (urlItemId) {
    const subArgs = {
      organizationId,
      _id: urlItemId,
      isDeleted: filter === STANDARD_FILTER_MAP.DELETED,
    };
    // get initializing state before subscription ready because it will be false always otherwise
    const initializing = getState('standards.initializing');

    subscription = DocumentCardSubs.subscribe('standardCard', subArgs);

    isCardReady = invokeReady(subscription);

    if (isCardReady) {
      const reviews = getReviews(urlItemId);
      actions = actions.concat([setReviews(reviews)]);
      // update standard in store when initializing
      // because observers are not running at that moment
      if (initializing) {
        const standard = Tracker.nonreactive(() => Standards.findOne({ _id: urlItemId }));

        if (standard) actions = actions.concat(updateStandard(standard));
      }
    }
  }

  actions = actions.concat(setIsCardReady(isCardReady));

  dispatch(batchActions(actions));

  onData(null, {});
}
