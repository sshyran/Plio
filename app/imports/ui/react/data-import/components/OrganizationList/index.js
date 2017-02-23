import React, { PropTypes } from 'react';

import Field from '../../../fields/read/components/Field';

const OrganizationList = ({ ownOrganizations, onOrgClick }) => (
  <div>
    {ownOrganizations.map(({ _id, name, ...org }) => (
      <Field tag="button" key={_id} onClick={e => onOrgClick({ _id, name, ...org }, e)}>
        {name}
      </Field>
    ))}
  </div>
);

OrganizationList.propTypes = {
  ownOrganizations: PropTypes.arrayOf(PropTypes.object),
  onOrgClick: PropTypes.func,
};

export default OrganizationList;
