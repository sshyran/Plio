import { batchActions } from 'redux-batched-actions';

import { Organizations } from '/imports/share/collections/organizations';
import { setOrg, setOrgId } from '/imports/client/store/actions/organizationsActions';
import { setDataLoading } from '/imports/client/store/actions/globalActions';
import { setOrganizations } from '/imports/client/store/actions/collectionsActions';
import { getId, invokeStop, invokeReady } from '/imports/api/helpers';

export default subscribe => function loadLayoutData({
    dispatch,
    orgSerialNumber,
    ...props
  }, onData) {
  const subscription = subscribe({ orgSerialNumber, ...props });

  if (!subscription) return false;

  if (invokeReady(subscription)) {
    const organization = Organizations.findOne({ serialNumber: orgSerialNumber });
    const organizationId = getId(organization);
    let actions = [
      setOrg(organization),
      setOrgId(organizationId),
      setDataLoading(false),
    ];

    if (organization) actions = actions.concat(setOrganizations([organization]));

    dispatch(batchActions(actions));

    onData(null, { loading: false });
  } else {
    dispatch(setDataLoading(true));

    onData(null, { loading: true });
  }

  return () => subscription &&
    typeof subscription.stop === 'function' &&
    invokeStop(subscription);
};
