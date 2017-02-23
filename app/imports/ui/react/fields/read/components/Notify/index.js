import React, { PropTypes } from 'react';

import Field from '../Field';
import Block from '../Block';
import { getFullNameOrEmail } from '/imports/api/users/helpers';

const Notify = ({ label = 'Notify changes', users = [] }) => (
  <Block>
    {label}
    <Field>
      {users.map(getFullNameOrEmail).join(', ')}
    </Field>
  </Block>
);

Notify.propTypes = {
  label: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Notify;
