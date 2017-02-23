import curry from 'lodash.curry';

import handleListRedirect from './handleListRedirect';
import handleListCollapse from './handleListCollapse';
import { getState } from '/imports/client/store';

const handleRedirectAndOpen = (getListData, goToDoc, goToDocs, createItem, items, childItemsByIds, {
  redirect = handleListRedirect,
  open = handleListCollapse,
  searchText,
  dispatch,
}) => setTimeout(() => {
  const { global: { urlItemId } } = getState();
  const {
    containedInArray,
    defaultContainedInArray,
    selectedDoc,
    defaultDoc,
    // containedIn,
    // defaultContainedIn,
  } = getListData(urlItemId, items);

  // if the document does not exist, do not expand.
  // show message that the document does not exist instead.
  if (urlItemId && !childItemsByIds[urlItemId]) return;

  // redirect to the selected or default document
  // and expand the collapse which contains that document
  redirect(goToDoc, goToDocs, selectedDoc, defaultDoc);
  if (!searchText) open(createItem, dispatch, containedInArray, defaultContainedInArray);
}, 0);

export default curry(handleRedirectAndOpen);
