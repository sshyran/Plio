import {
  SET_DATA_IMPORT_OWN_ORGS,
  SET_DATA_IMPORT_ORGS_LOADING,
  SET_DATA_IMPORT_ORGS_LOADED,
  SET_DATA_IMPORT_ORGS_COLLAPSED,
  SET_DATA_IMPORT_MODAL_OPENED_STATE,
  SET_DATA_IMPORT_IN_PROGRESS,
  SET_DATA_IMPORT_IDS,
} from '../actions/types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  ownOrganizations: [],
  areOrgsCollapsed: true,
  isModalOpened: false,
  isInProgress: false,
  importedIds: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA_IMPORT_OWN_ORGS:
    case SET_DATA_IMPORT_ORGS_LOADING:
    case SET_DATA_IMPORT_ORGS_LOADED:
    case SET_DATA_IMPORT_ORGS_COLLAPSED:
    case SET_DATA_IMPORT_MODAL_OPENED_STATE:
    case SET_DATA_IMPORT_IN_PROGRESS:
    case SET_DATA_IMPORT_IDS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
