import { batchActions } from 'redux-batched-actions';
import { SHA256 } from 'meteor/sha';
import pluralize from 'pluralize';

import { OrgSubs } from '/imports/startup/client/subsmanagers';
import { createOrgQueryWhereUserIsOwner } from '/imports/api/queries';
import { Organizations } from '/imports/share/collections/organizations';
import {
  setOwnOrgs,
  setOrgsLoading,
  setOrgsLoaded,
  setOrgsCollapsed,
  setDataImportInProgress,
} from '/imports/client/store/actions/dataImportActions';
import { callMethod, setErrorText, close } from '/imports/client/store/actions/modalActions';
import swal from '/imports/ui/utils/swal';
import { importDocuments } from '/imports/api/organizations/methods';

export const onToggleCollapse = ({
  dispatch,
  userId,
  isLoaded,
  loading,
  collapsed,
  organizationId,
}) => () => {
  const loadFetchDataAndToggle = () => {
    dispatch(setOrgsLoading(true));

    const onReady = () => {
      const query = {
        _id: { $ne: organizationId },
        ...createOrgQueryWhereUserIsOwner(userId),
      };
      const options = { sort: { serialNumber: 1 } };
      const organizations = Organizations.find(query, options).fetch();
      const actions = [
        setOwnOrgs(organizations),
        setOrgsLoaded(true),
        setOrgsLoading(false),
        setOrgsCollapsed(false),
      ];

      dispatch(batchActions(actions));
    };

    OrgSubs.subscribe('dataImportUserOwnOrganizations', onReady);
  };
  // when the user first time clicks on the collapse load and fetch the data
  // otherwise just toggle the collapse
  if (collapsed && !isLoaded && !loading) loadFetchDataAndToggle();
  else if (!loading && isLoaded) dispatch(setOrgsCollapsed(!collapsed));
};

export const onOrgClick = ({
  dispatch,
  documentType,
  organizationId,
  getDocsCount,
  onSuccess,
}) => ({ _id: from, name }) => {
  const onConfirm = (pwd) => {
    const _onSuccess = (res) => {
      dispatch(close);

      swal.success(
        'Success',
        `Data import from ${name} organization has been successfully completed`
      );
      if (typeof onSuccess === 'function') onSuccess(res);
    };

    if (!pwd) {
      swal.close();
      return dispatch(setErrorText('Password can not be empty'));
    }

    const password = SHA256(pwd); // eslint-disable-line new-cap
    const methodProps = {
      documentType,
      password,
      from,
      to: organizationId,
    };
    const action = callMethod(importDocuments, methodProps);

    dispatch(setDataImportInProgress(true));

    return dispatch(action).then(_onSuccess);
  };

  const showPwdForm = () => swal.showPasswordForm({
    title: `Confirm data import from "${name}" organization`,
  }, onConfirm);

  const showAlert = (__, count = '') => swal({
    text: `
      Do you want to import ${count} ${documentType} ${pluralize('documents', count)}
      from "${name}" organization?
    `,
    confirmButtonText: 'Yes',
  }, showPwdForm);

  showAlert();

  if (typeof getDocsCount === 'function') {
    getDocsCount({ organizationId: from, isDeleted: false }, showAlert);
  }
};
