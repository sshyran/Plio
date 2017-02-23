import {
  SET_STANDARDS,
  ADD_STANDARD,
  UPDATE_STANDARD,
  REMOVE_STANDARD,
} from '../../actions/types';
import { normalizeData, add, update, remove } from '../../lib/normalize';

const initialState = {
  entities: {},
  allIds: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_STANDARDS:
      return normalizeData(state, action);
    case ADD_STANDARD:
      return add(state, action);
    case UPDATE_STANDARD:
      return update(state, action);
    case REMOVE_STANDARD:
      return remove(state, action);
    default:
      return state;
  }
}
