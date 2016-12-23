import React, { PropTypes } from 'react';
import cx from 'classnames';

import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';
import { CUSTOMER_SEQUENTIAL_ID } from '../../constants';

const CustomersListItem = ({ isActive, onClick, href, name, owner, createdAt, serialNumber }) => (
  <ListItemLink {...{ isActive, onClick, href }}>
    <ListItem>
      <div className="flexbox-row">
        <ListItem.Heading>
          <span className="margin-right">
            {cx(serialNumber && `${CUSTOMER_SEQUENTIAL_ID}${serialNumber}`, name)}
          </span>
        </ListItem.Heading>
      </div>
      <ListItem.LeftText>
        <span>{owner}</span>
      </ListItem.LeftText>
      <ListItem.RightText>
        <span>{createdAt}</span>
      </ListItem.RightText>
    </ListItem>
  </ListItemLink>
);

CustomersListItem.propTypes = {
  href: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  _id: PropTypes.string,
  serialNumber: PropTypes.number,
  name: PropTypes.string,
  createdAt: PropTypes.string,
  owner: PropTypes.string,
};

export default CustomersListItem;
