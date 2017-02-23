import React, { PropTypes } from 'react';
import cx from 'classnames';
import { pure } from 'recompose';
import { _ } from 'meteor/underscore';

import Collapse from '../Collapse';
import Icon from '../Icons/Icon';
import { Pull } from '../Utility';

const handleToggleCollapse = _.throttle(onToggleCollapse => onToggleCollapse(), 400);

const CollapseBlock = ({
  collapsed,
  children,
  onToggleCollapse,
  chevron,
  tag: Tag = 'a',
  classNames: {
    head = 'list-group-item list-group-subheading list-group-toggle pointer',
    body = 'list-group-collapse collapse',
    wrapper = '',
  } = {},
  ...other
}) => (
  <div className={wrapper}>
    <Tag
      onClick={() => handleToggleCollapse(onToggleCollapse)}
      className={cx(head, { collapsed })}
    >
      {children[0]}
      {chevron && (
        <Pull right>
          <Icon name={collapsed ? 'chevron-down' : 'chevron-up'} className="text-muted" />
        </Pull>
      )}
    </Tag>
    <Collapse className={body} {...{ ...other, collapsed }}>
      {children[1]}
    </Collapse>
  </div>
);

CollapseBlock.propTypes = {
  onToggleCollapse: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  classNames: PropTypes.shape({
    head: PropTypes.string,
    body: PropTypes.string,
    wrapper: PropTypes.string,
  }),
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  chevron: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onCollapseShow: PropTypes.func,
  onCollapseShown: PropTypes.func,
  onCollapseHide: PropTypes.func,
  onCollapseHidden: PropTypes.func,
};

export default pure(CollapseBlock);
