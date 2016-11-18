import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { equals } from '/imports/api/helpers';
import {
  SET_USER_ID,
  SET_FILTER,
  SET_SEARCH_TEXT,
  ADD_COLLAPSED,
  REMOVE_COLLAPSED,
  SET_ANIMATING,
  SET_URL_ITEM_ID,
} from './types';

export function setUserId(userId) {
  return {
    payload: { userId },
    type: SET_USER_ID,
  };
}

export function setFilter(filter) {
  return {
    payload: { filter },
    type: SET_FILTER,
  };
}

export function setSearchText(searchText) {
  return {
    payload: { searchText },
    type: SET_SEARCH_TEXT,
  };
}

export function setAnimating(animating) {
  return {
    payload: { animating },
    type: SET_ANIMATING,
  };
}

export function setUrlItemId(urlItemId) {
  return {
    payload: { urlItemId },
    type: SET_URL_ITEM_ID,
  };
}

export function addCollapsed(payload) {
  return {
    payload,
    type: ADD_COLLAPSED,
    meta: {
      throttle: 400,
    },
  };
}

export function removeCollapsed(payload) {
  return {
    payload,
    type: REMOVE_COLLAPSED,
  };
}

export function toggleCollapsed(payload) {
  return (dispatch, getState) => {
    const withoutClose = _.omit(payload, 'close');
    const collapsed = getState().global.collapsed.find(equals(withoutClose));

    return collapsed
      ? dispatch(removeCollapsed(withoutClose))
      : dispatch(addCollapsed(payload));
  };
}

export function chainActions(actions, wait = 400) {
  return (dispatch, getState) =>
    new Promise((resolve) => {
      const start = (i) => {
        if (i === actions.length) return resolve(dispatch, getState);

        dispatch(actions[i]);

        return Meteor.setTimeout(() => start(i + 1), wait);
      };

      start(0);
    });
}