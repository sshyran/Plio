import { batchActions } from 'redux-batched-actions';

import { RiskTypes } from '/imports/share/collections/risk-types';
import { Risks } from '/imports/share/collections/risks';
import {
  setRisks,
  setRiskTypes,
} from '/imports/client/store/actions/collectionsActions';

export default function loadMainData({ dispatch, organizationId }, onData) {
  const query = { organizationId };
  const options = { sort: { title: 1 } };
  const types = RiskTypes.find(query, options).fetch();
  const risks = Risks.find(query, options).fetch();

  const actions = [
    setRiskTypes(types),
    setRisks(risks),
  ];

  dispatch(batchActions(actions));

  onData(null, {});
}
