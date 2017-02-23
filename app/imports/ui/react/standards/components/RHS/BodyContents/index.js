import React, { PropTypes } from 'react';
import cx from 'classnames';
import { Col, Row, ListGroup } from 'reactstrap';

import { getFullNameOrEmail } from '/imports/api/users/helpers';
import { length } from '/imports/api/helpers';
import { DocumentTypes } from '/imports/share/constants';
import createReadFields from '../../../../helpers/createReadFields';
import DepartmentsContainer from '../../../../fields/read/containers/DepartmentsContainer';
import Source from '../../../../fields/read/components/Source';
import Notify from '../../../../fields/read/components/Notify';
import ImprovementPlan from '../../../../fields/read/components/ImprovementPlan';
import FileProvider from '../../../../containers/providers/FileProvider';
import ConnectedDocListContainer from '../../../fields/read/containers/ConnectedDocListContainer';
import ReviewsContainer from '/imports/ui/react/fields/read/containers/ReviewsContainer';

const propTypes = {
  _id: PropTypes.string,
  description: PropTypes.string,
  issueNumber: PropTypes.number,
  owner: PropTypes.object,
  departmentsIds: PropTypes.arrayOf(PropTypes.string),
  source1: PropTypes.object,
  source2: PropTypes.object,
  section: PropTypes.object,
  type: PropTypes.object,
  files: PropTypes.arrayOf(PropTypes.object),
  notify: PropTypes.arrayOf(PropTypes.object),
  improvementPlan: PropTypes.object,
};

const BodyContents = ({
  _id,
  description,
  issueNumber,
  owner,
  departmentsIds = [],
  source1,
  source2,
  notify,
  improvementPlan,
  section = {},
  type = {},
}) => {
  const render = (field) => (<Col sm="6">{field}</Col>);
  const data = [
    { label: 'Description', text: description },
    { label: 'Issue number', text: issueNumber, render },
    { label: 'Section', text: section.title, render },
    { label: 'Type', text: cx(type.title, type.abbreviation && `(${type.abbreviation})`), render },
    { label: 'Owner', text: getFullNameOrEmail(owner), render },
  ];
  const fields = createReadFields(data);

  return (
    <div>
      <ListGroup>
        {fields.description}

        <Row>
          {fields.issueNumber}
          {fields.section}
        </Row>

        <Row>
          {fields.type}
          {fields.owner}
        </Row>

        {!!length(departmentsIds) && (
          <DepartmentsContainer departmentsIds={departmentsIds} />
        )}

        {[source1, source2].map((source, i) => source && (
          <FileProvider
            key={i}
            id={i + 1}
            component={Source}
            flat={false}
            {...{ ...source, fileId: source.fileId || '' }}
          />
        ))}
      </ListGroup>

      {!!length(notify) && (<Notify users={notify} />)}

      <ConnectedDocListContainer standardId={_id}>
        {improvementPlan && (
          <ImprovementPlan
            label="Improvement Plan"
            {...improvementPlan}
          />
        )}
      </ConnectedDocListContainer>

      <ReviewsContainer documentId={_id} documentType={DocumentTypes.STANDARD} />
    </div>
  );
};

BodyContents.propTypes = propTypes;

export default BodyContents;
