import { Meteor } from 'meteor/meteor';

import modal from '/imports/startup/client/mixins/modal';
import { RisksHelp } from '/imports/api/help-messages';
import swal from '/imports/ui/utils/swal';
import { restore, remove } from '/imports/api/risks/methods';
import { isOrgOwner } from '/imports/api/checkers';
import { RiskFilterIndexes, ALERT_AUTOHIDE_TIME } from '/imports/api/constants';
import { goTo } from '../../../../utils/router/actions';

export const onModalOpen = ({ _id }) => () =>
  modal.modal.open({
    _id,
    _title: 'Risk',
    template: 'Risks_Card_Edit',
    helpText: RisksHelp.risk,
  });


export const onRestore = ({
  _id,
  title,
  isDeleted,
}) => () => {
  if (!isDeleted) return;

  const options = {
    text: `The risk "${title}" will be restored!`,
    confirmButtonText: 'Restore',
  };
  const cb = (err) => {
    if (err) swal.error(err);

    swal({
      title: 'Restored!',
      text: `The risk "${title}" was restored successfully.`,
      type: 'success',
      timer: ALERT_AUTOHIDE_TIME,
      showConfirmButton: false,
    });

    const params = { urlItemId: _id };
    const queryParams = { filter: RiskFilterIndexes.TYPE };

    Meteor.defer(() => goTo('risk')(params, queryParams));
  };

  swal(options, () => restore.call({ _id }, cb));
};

export const onDelete = ({
  _id,
  title,
  isDeleted,
  userId,
  organizationId,
}) => () => {
  if (!isDeleted || !isOrgOwner(userId, organizationId)) return;

  const options = {
    text: `The risk "${title}" will be deleted permanently!`,
    confirmButtonText: 'Delete',
  };
  const cb = (err) => {
    if (err) swal.error(err);

    swal({
      title: 'Deleted!',
      text: `The risk "${title}" was removed successfully.`,
      type: 'success',
      timer: ALERT_AUTOHIDE_TIME,
      showConfirmButton: false,
    });
  };

  swal(options, () => remove.call({ _id }, cb));
};
