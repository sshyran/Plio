import React, { PropTypes } from 'react';

import DiscussButton from '../../../../components/Buttons/DiscussButton';
import Button from '../../../../components/Buttons/Button';

const HeaderButtons = (props) => {
  const discussionButton = !props.isDiscussionOpened && (
    <DiscussButton
      onClick={props.onDiscussionOpen}
      href={props.pathToDiscussion}
      unreadMessagesCount={props.unreadMessagesCount}
    >
      Discuss
    </DiscussButton>
  );

  const restoreButton = props.hasAccess && props.isDeleted && (
    <Button type="secondary" onClick={props.onRestore}>
      Restore
    </Button>
  );

  const deleteButton = (
    props.hasAccess &&
    props.isDeleted &&
    props.hasFullAccess && (
      <Button type="primary" onClick={props.onDelete}>
        Delete
      </Button>
    )
  );

  const editButton = !props.isDeleted && (
    <Button type="primary" onClick={props.onModalOpen} >
      Edit
    </Button>
  );

  return (
    <div>
      {discussionButton}
      {restoreButton}
      {deleteButton}
      {editButton}
    </div>
  );
};

HeaderButtons.propTypes = {
  isDiscussionOpened: PropTypes.bool,
  isDeleted: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
  hasAccess: PropTypes.bool,
  hasFullAccess: PropTypes.bool,
  onToggleScreenMode: PropTypes.func,
  pathToDiscussion: PropTypes.string,
  onDiscussionOpen: PropTypes.func,
  onRestore: PropTypes.func,
  onDelete: PropTypes.func,
  onModalOpen: PropTypes.func,
};

export default HeaderButtons;
