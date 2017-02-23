import { Meteor } from 'meteor/meteor';

import _counter_ from '/imports/startup/client/mixins/counter';
import { NOT_VIEWED_COUNTER_PREFIX } from '../constants';

import {
  setStandardMessagesNotViewedCountMap,
} from '/imports/client/store/actions/countersActions';

export default function loadCountersData({ dispatch, standards }, onData) {
  const subscriptions = standards.map(({ _id }) => Meteor.subscribe(
    'messagesNotViewedCount',
    NOT_VIEWED_COUNTER_PREFIX + _id,
    _id
  ));

  if (subscriptions.every(subscription => subscription.ready())) {
    const unreadMessagesCountMap = standards.reduce((map, { _id }) => ({
      ...map,
      [_id]: _counter_.get(NOT_VIEWED_COUNTER_PREFIX + _id),
    }), {});

    dispatch(setStandardMessagesNotViewedCountMap(unreadMessagesCountMap));
  }

  onData(null, {});

  return () => subscriptions.map(subscription => subscription.stop());
}
