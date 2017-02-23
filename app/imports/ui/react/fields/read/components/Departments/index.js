import React, { PropTypes } from 'react';
import property from 'lodash.property';

import Field from '../Field';

const Departments = ({
  departments = [],
  label = 'Department(s)',
}) => (
  <Field {...{ label }}>
    {departments.map(property('name')).join(', ')}
  </Field>
);

Departments.propTypes = {
  departments: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
};

export default Departments;
