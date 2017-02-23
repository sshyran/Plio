import { _ } from 'meteor/underscore';

import {
  addRisk,
  updateRisk,
  removeRisk,
  addRiskType,
  updateRiskType,
  removeRiskType,
} from '/imports/client/store/actions/collectionsActions';
import { Risks } from '/imports/share/collections/risks';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { expandCollapsedRisks } from './helpers';
import { getState } from '/imports/client/store';
import { propEq, getId } from '/imports/api/helpers';
import { goTo } from '../../utils/router/actions';

export const observeRisks = (dispatch, query, options) => {
  const handle = Risks.find(query, options).observeChanges({
    added(_id, fields) {
      if (handle) {
        dispatch(addRisk({ _id, ...fields }));

        if (fields.createdBy === getState('global.userId')) {
          expandCollapsedRisks(_id);
        }
      }
    },
    changed(_id, fields) {
      dispatch(updateRisk({ _id, ...fields }));

      // expand the section and type that are holding selected risk
      if (getState('global.urlItemId') === _id && (
          fields.status ||
          fields.typeId ||
          fields.departmentsIds)) {
        expandCollapsedRisks(_id, true);
      }
    },
    removed(_id) {
      dispatch(removeRisk(_id));

      if (getState('global.urlItemId') === _id) {
        const risks = getState('collections.risks').filter(propEq('isDeleted', true));
        const urlItemId = getId(_.first(risks));
        // redirect to the first risk if the selected risk is removed
        goTo('risk')({ urlItemId });
      }
    },
  });

  return handle;
};

export const observeRiskTypes = (dispatch, query, options) => {
  const handle = RiskTypes.find(query, options).observeChanges({
    added(_id, fields) {
      if (handle) {
        dispatch(addRiskType({ _id, ...fields }));
      }
    },
    changed(_id, fields) {
      dispatch(updateRiskType({ _id, ...fields }));
    },
    removed(_id) {
      dispatch(removeRiskType(_id));
    },
  });

  return handle;
};
