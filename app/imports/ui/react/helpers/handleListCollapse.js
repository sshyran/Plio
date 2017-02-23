import property from 'lodash.property';

import {
  mapC,
  filterC,
  compose,
  some,
  propEqType,
  propEqKey,
  not,
  find,
} from '/imports/api/helpers';
import { addCollapsedWithClose, chainActions } from '/imports/client/store/actions/globalActions';


const handleListCollapse = (createItem, dispatch, containedInArray, defaultContainedInArray) => {
  const parentItems = containedInArray.length ? containedInArray : defaultContainedInArray;
  const items = compose(filterC(property('key')), mapC(createItem))(parentItems);

  if (!items.length) return false;

  // close items that are not the current item's type or that are not contained in 'items' array
  // item => collapsed[item] => Bool
  const findKey = ({ key }) => find(propEqKey(key), items);
  const close = ({ type }) => some([
    findKey,
    compose(not, propEqType(type)),
  ]);

  const actions = mapC(addCollapsedWithClose(close), items);

  return dispatch(chainActions(actions));
};

export default handleListCollapse;
