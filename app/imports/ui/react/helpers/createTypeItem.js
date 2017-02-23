import curry from 'lodash.curry';

const createTypeItem = curry((type, key) => ({
  key,
  type,
}));

export default createTypeItem;
 
