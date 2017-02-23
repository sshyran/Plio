import React from 'react';

import StandardListItemContainer from '../../containers/StandardListItemContainer';

const StandardList = (props) => (
  <div className="list-group">
    {props.standards.map(standard => (
      <StandardListItemContainer
        key={standard._id}
        section={props.section}
        orgSerialNumber={props.orgSerialNumber}
        organization={props.organization}
        userId={props.userId}
        filter={props.filter}
        urlItemId={props.urlItemId}
        _id={standard._id}
        type={standard.type}
        {...standard}
      />
    ))}
  </div>
);

export default StandardList;
