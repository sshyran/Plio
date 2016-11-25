import { compareProps, equals, compose, not } from '/imports/api/helpers';

/**
 * @param {Object[]} collapsed - array of all currently collapsed items
 * @param {Object} payload - item to add to the list
 * @param {Object|Function} payload.close - Either an object or a function which is used to filter the items
 * @returns unique array of items
 */
export const addCollapsed = (collapsed, payload) => {
  const withoutClose = _.omit(payload, 'close');
  const result = ((() => {
    if (_.isFunction(payload.close)) {
      return collapsed.filter(payload.close).concat(withoutClose);
    }

    return payload.close && !_.isEmpty(payload.close)
      ? collapsed.filter(compose(not, compareProps(payload.close))).concat(withoutClose)
      : collapsed.concat(withoutClose);
  })());

  return _.uniq(result, true, (el, i, array) => array.find(equals(el)));
}

export const removeCollapsed = (collapsed, payload) => {
  const idx = collapsed.findIndex(equals(payload));
  const result = idx === -1
    ? collapsed
    : collapsed.slice(0, idx).concat(collapsed.slice(idx + 1, collapsed.length));

  return result;
}
