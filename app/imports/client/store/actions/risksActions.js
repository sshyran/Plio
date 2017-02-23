import {
  SET_FILTERED_RISKS,
  SET_RISK_DEPS_READY,
  SET_RISKS_INITIALIZING,
} from './types';

export function setFilteredRisks(risksFiltered) {
  return {
    payload: { risksFiltered },
    type: SET_FILTERED_RISKS,
  };
}

export function setDepsReady(areDepsReady) {
  return {
    payload: { areDepsReady },
    type: SET_RISK_DEPS_READY,
  };
}

export function setInitializing(initializing) {
  return {
    type: SET_RISKS_INITIALIZING,
    payload: { initializing },
  };
}
