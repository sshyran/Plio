import React, { PropTypes } from 'react';
import { CardTitle } from 'reactstrap';
import cx from 'classnames';
import { setPropTypes, branch } from 'recompose';
import property from 'lodash.property';

import withStateCollapsed from '../../helpers/withStateCollapsed';
import CollapseBlock from '../CollapseBlock';
import IconLoading from '../Icons/IconLoading';

const enhance = branch(
  property('onToggleCollapse'),
  setPropTypes({
    collapsed: PropTypes.bool.isRequired,
    onToggleCollapse: PropTypes.func.isRequired,
  }),
  withStateCollapsed(true),
);

const CardBlockCollapse = enhance(({
  collapsed,
  onToggleCollapse,
  leftText,
  rightText,
  loading,
  children,
  props: {
    collapseBlock: { tag = 'div', ...collapseBlock } = {},
    leftText: { className: lTextCx, ...lTextProps } = {},
    rightText: { className: rTextCx, ...rTextProps } = {},
  } = {},
}) => {
  let rightContent = null;
  const classNames = {
    head: 'card-block card-block-collapse-toggle',
    body: 'card-block-collapse collapse',
  };

  if (loading) rightContent = <IconLoading />;

  else if (rightText) rightContent = <span className="text-muted">{rightText}</span>;

  return (
    <CollapseBlock {...{ tag, classNames, collapsed, onToggleCollapse, ...collapseBlock }}>
      <div>
        <CardTitle className={cx('pull-xs-left', lTextCx)} {...lTextProps}>
          {leftText}
        </CardTitle>
        {rightContent && (
          <CardTitle className={cx('pull-xs-right', rTextCx)} {...rTextProps}>
            {rightContent}
          </CardTitle>
        )}
      </div>
      {children}
    </CollapseBlock>
  );
});

CardBlockCollapse.propTypes = {
  leftText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rightText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  loading: PropTypes.bool,
  children: PropTypes.node,
};

export default CardBlockCollapse;
