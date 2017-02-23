import { Tracker } from 'meteor/tracker';
import { batchActions } from 'redux-batched-actions';

import { DocumentCardSubs } from '/imports/startup/client/subsmanagers';
import { setIsCardReady } from '/imports/client/store/actions/globalActions';
import { updateRisk, setReviews } from '/imports/client/store/actions/collectionsActions';
import { getState } from '/imports/client/store';
import { Risks } from '/imports/share/collections/risks';
import { Reviews } from '/imports/share/collections/reviews';
import { invokeReady } from '/imports/api/helpers';
import { DocumentTypes } from '/imports/share/constants';

const getReviews = (documentId) => {
  const query = { documentId, documentType: DocumentTypes.RISK };
  const options = { sort: { reviewedAt: -1 } };
  return Reviews.find(query, options).fetch();
};

export default function loadCardData({
  dispatch,
  organizationId,
  urlItemId,
}, onData) {
  let subscription;
  let isCardReady = true;
  let actions = [];

  if (urlItemId) {
    const subArgs = { organizationId, _id: urlItemId };
    // get initializing state before subscription ready because it will be false always otherwise
    const initializing = getState('risks.initializing');

    subscription = DocumentCardSubs.subscribe('riskCard', subArgs);

    isCardReady = invokeReady(subscription);

    if (isCardReady) {
      const reviews = getReviews(urlItemId);
      actions = actions.concat([setReviews(reviews)]);
      // update risk in store when initializing
      // because observers are not running at that moment
      if (initializing) {
        const risk = Tracker.nonreactive(() => Risks.findOne({ _id: urlItemId }));

        if (risk) actions = actions.concat(updateRisk(risk));
      }
    }
  }

  actions = actions.concat(setIsCardReady(isCardReady));

  dispatch(batchActions(actions));

  onData(null, {});
}
