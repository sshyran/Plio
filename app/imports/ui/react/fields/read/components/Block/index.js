import React, { PropTypes } from 'react';
import { CardBlock, ListGroup, CardTitle } from 'reactstrap';
import cx from 'classnames';

const Block = ({
  wrapper,
  heading: { className: headingCx, ...heading } = {},
  title,
  listGroup,
  children,
}) => (
  <div {...wrapper}>
    <CardBlock className={cx('card-subheading', headingCx)} {...heading}>
      <CardTitle {...title}>{children[0]}</CardTitle>
    </CardBlock>

    <ListGroup {...listGroup}>
      {children[1]}
    </ListGroup>
  </div>
);

Block.propTypes = {
  wrapper: PropTypes.object,
  heading: PropTypes.object,
  title: PropTypes.object,
  listGroup: PropTypes.object,
  children: PropTypes.node,
};

export default Block;
