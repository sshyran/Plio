import {
  SET_DEPARTMENTS,
  SET_FILES,
  SET_NCS,
  SET_RISKS,
  SET_ACTIONS,
  SET_WORK_ITEMS,
  SET_LESSONS_LEARNED,
} from './types';

export function setDepartments(departments) {
  return {
    type: SET_DEPARTMENTS,
    payload: { departments },
  };
}

export function setFiles(files) {
  return {
    type: SET_FILES,
    payload: { files },
  };
}

export function setNCs(ncs) {
  return {
    type: SET_NCS,
    payload: { ncs },
  };
}

export function setRisks(risks) {
  return {
    type: SET_RISKS,
    payload: { risks },
  };
}

export function setActions(actions) {
  return {
    type: SET_ACTIONS,
    payload: { actions },
  };
}

export function setWorkItems(workItems) {
  return {
    type: SET_WORK_ITEMS,
    payload: { workItems },
  };
}

export function setLessons(lessons) {
  return {
    type: SET_LESSONS_LEARNED,
    payload: { lessons },
  };
}
