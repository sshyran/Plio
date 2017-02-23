import { _ } from 'meteor/underscore';

import {
  addStandard,
  updateStandard,
  removeStandard,
  addStandardBookSection,
  updateStandardBookSection,
  removeStandardBookSection,
  addStandardType,
  updateStandardType,
  removeStandardType,
} from '/imports/client/store/actions/collectionsActions';
import { Standards } from '/imports/share/collections/standards';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import { expandCollapsedStandard } from './helpers';
import { getState } from '/imports/client/store';
import { propEq, getId } from '/imports/api/helpers';
import { goTo } from '../../utils/router/actions';

export const observeStandards = (dispatch, query, options) => {
  const observer = Standards.find(query, options).observeChanges({
    added(_id, fields) {
      if (observer) {
        // do not add imported standards through observer
        // as they will be added through a single action
        const { importedIds = {} } = getState().dataImport;

        if (importedIds[_id]) return;

        dispatch(addStandard({ _id, ...fields }));
        // expand the section and type that are holding a newly created standard
        expandCollapsedStandard(_id);
      }
    },
    changed(_id, fields) {
      dispatch(updateStandard({ _id, ...fields }));

      // expand the section and type that are holding selected standard
      if (getState('global.urlItemId') === _id && (fields.sectionId || fields.typeId)) {
        expandCollapsedStandard(_id);
      }
    },
    removed(_id) {
      dispatch(removeStandard(_id));

      if (getState('global.urlItemId') === _id) {
        const standards = getState('collections.standards').filter(propEq('isDeleted', true));
        const urlItemId = getId(_.first(standards));
        // redirect to the first standard if the selected standard is removed
        goTo('standard')({ urlItemId });
      }
    },
  });

  return observer;
};

export const observeStandardBookSections = (dispatch, query, options) => {
  const observer = StandardsBookSections.find(query, options).observeChanges({
    added(_id, fields) {
      if (observer) {
        dispatch(addStandardBookSection({ _id, ...fields }));
      }
    },
    changed(_id, fields) {
      dispatch(updateStandardBookSection({ _id, ...fields }));
    },
    removed(_id) {
      dispatch(removeStandardBookSection(_id));
    },
  });

  return observer;
};

export const observeStandardTypes = (dispatch, query, options) => {
  const observer = StandardTypes.find(query, options).observeChanges({
    added(_id, fields) {
      if (observer) {
        dispatch(addStandardType({ _id, ...fields }));
      }
    },
    changed(_id, fields) {
      dispatch(updateStandardType({ _id, ...fields }));
    },
    removed(_id) {
      dispatch(removeStandardType(_id));
    },
  });

  return observer;
};
