import { compose, mapProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { getPath } from '../../../../utils/router/paths';
import { canChangeStandards, isOrgOwner } from '/imports/api/checkers';
import { pickDeep } from '/imports/api/helpers';
import {
  onDiscussionOpen,
  onModalOpen,
  onRestore,
  onDelete,
} from './handlers';
import HeaderButtons from '../../components/RHS/HeaderButtons';

export default compose(
  connect(pickDeep([
    'global.isFullScreenMode',
    'global.userId',
    'organizations.organizationId',
    'discussion.isDiscussionOpened',
  ])),

  mapProps(({ risk: { _id, title, isDeleted = false }, organizationId, userId, ...props }) => {
    const hasAccess = canChangeStandards(userId, organizationId);
    const hasFullAccess = isOrgOwner(userId, organizationId);
    const pathToDiscussion = getPath('riskDiscussion')({ urlItemId: _id });

    return {
      ...props,
      userId,
      organizationId,
      _id,
      title,
      hasAccess,
      hasFullAccess,
      pathToDiscussion,
      isDeleted,
    };
  }),
  withHandlers({
    onDiscussionOpen,
    onModalOpen,
    onRestore,
    onDelete,
  }),
)(HeaderButtons);
