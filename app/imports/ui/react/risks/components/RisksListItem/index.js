import React, { PropTypes } from 'react';
import cx from 'classnames';

import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import Label from '../../../components/Labels/Label';
import { getC } from '/imports/api/helpers';

const RiskListItem = ({
  isActive,
  title,
  sequentialId,
  isDeleted,
  createdAtText,
  deletedByText,
  deletedAtText,
  unreadMessagesCount,
  isNew,
  primaryScore = {},
  attrs = {},
  ...other
}) => (
  <ListItemLink
    {...{ isActive, ...other }}
  >
    {primaryScore.value && (
      <Label className={cx('risk-square', getC('primaryScore.className', attrs))}>
        {primaryScore.value}
      </Label>
    )}

    <ListItem>
      <div className="flexbox-row">
        <ListItem.Heading>
          <span className="margin-right">{title}</span>

          {isNew && (
            <Label names="primary">New</Label>
          )}
        </ListItem.Heading>
        <div className="flex">
          {isDeleted && (
            <ListItem.RightText>
              {`Deleted by ${deletedByText}`}
            </ListItem.RightText>
          )}
          {!!unreadMessagesCount && !isDeleted && (
            <ListItem.RightText className="text-danger">
              <LabelMessagesCount count={unreadMessagesCount} />
            </ListItem.RightText>
          )}
        </div>
      </div>
      <ListItem.LeftText className={getC('sequentialId.className', attrs)}>
        {sequentialId}
      </ListItem.LeftText>
      <ListItem.RightText>
        {isDeleted ? deletedAtText : createdAtText}
      </ListItem.RightText>
    </ListItem>
  </ListItemLink>
);

RiskListItem.propTypes = {
  isActive: PropTypes.bool,
  title: PropTypes.string.isRequired,
  sequentialId: PropTypes.string.isRequired,
  isDeleted: PropTypes.bool,
  createdAtText: PropTypes.string,
  deletedByText: PropTypes.string,
  deletedAtText: PropTypes.string,
  unreadMessagesCount: PropTypes.number,
  isNew: PropTypes.bool,
  primaryScore: PropTypes.object,
  attrs: PropTypes.object,
};

export default RiskListItem;
