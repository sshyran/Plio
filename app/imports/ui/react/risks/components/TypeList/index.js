import React, { PropTypes } from 'react';

import TypeListItem from '../TypeListItem';

const TypeList = ({ types, onToggleCollapse }) => (
  <div>
    {types.map(type => (<TypeListItem key={type._id} {...{ type, onToggleCollapse }} />))}
  </div>
);

TypeList.propTypes = {
  types: PropTypes.array.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default TypeList;
