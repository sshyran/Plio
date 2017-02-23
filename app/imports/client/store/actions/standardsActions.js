import {
  SET_FILTERED_STANDARDS,
  SET_STANDARD_DEPS_READY,
  SET_STANDARDS_INITIALIZING,
  SORT_STANDARDS,
} from './types';

export function setFilteredStandards(standardsFiltered) {
  return {
    payload: { standardsFiltered },
    type: SET_FILTERED_STANDARDS,
  };
}

export function setDepsReady(areDepsReady) {
  return {
    payload: { areDepsReady },
    type: SET_STANDARD_DEPS_READY,
  };
}

export function setInitializing(initializing) {
  return {
    type: SET_STANDARDS_INITIALIZING,
    payload: { initializing },
  };
}

export function sortStandards(filter) {
  return {
    type: SORT_STANDARDS,
    payload: { filter },
  };
}
