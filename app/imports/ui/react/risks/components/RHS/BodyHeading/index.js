import React from 'react';

import propTypes from './propTypes';

const RisksRHSBodyHeading = ({ title }) => (
  <div className="flexbox-row">
    <h4 className="list-group-item-heading pull-left">
      <span>{title}</span>
    </h4>
    <div className="flex"></div>
  </div>
);

RisksRHSBodyHeading.propTypes = propTypes;

export default RisksRHSBodyHeading;
