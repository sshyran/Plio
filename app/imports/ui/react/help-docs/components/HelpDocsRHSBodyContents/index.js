import React from 'react';
import { Col } from 'reactstrap';

import createReadFields from '../../../helpers/createReadFields';
import Source from '../../../fields/read/components/Source';
import propTypes from './propTypes';

const HelpDocsRHSBodyContents = (props) => {
  const { source, section, file, owner, issueNumber } = props;

  const wrap = 'col-md-6';
  const render = field => (<Col sm="6">{field}</Col>);
  const fieldsData = [
    { label: 'Section', text: section ? section.title : '' },
    { label: 'Owner', text: owner ? owner.fullNameOrEmail() : '', render },
  ];

  if (props.userHasChangeAccess) {
    fieldsData.push({ label: 'Issue number', text: issueNumber, wrap });
  }

  const fields = createReadFields(fieldsData);

  return (
    <div className="list-group">
      {fields.section}

      <div className="row">
        {props.userHasChangeAccess ? fields.issueNumber : ''}
        {fields.owner}
      </div>

      {source ? (
        <Source {...source} file={file} id={1} />
      ) : ''}
    </div>
  );
};

HelpDocsRHSBodyContents.propTypes = propTypes;

export default HelpDocsRHSBodyContents;
