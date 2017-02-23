import React, { PropTypes } from 'react';
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

const Field = ({
  label,
  children,
  text = {},
  heading: { tag: headingTag = 'h4', ...heading } = {},
  ...other
}) => (
  <ListGroupItem {...other}>
    {label && (
      <ListGroupItemText {...text}>{label}</ListGroupItemText>
    )}
    <ListGroupItemHeading tag={headingTag} {...{ ...heading }}>
      {children}
    </ListGroupItemHeading>
  </ListGroupItem>
);

Field.propTypes = {
  heading: PropTypes.object,
  text: PropTypes.object,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
};

export default Field;
