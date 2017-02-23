import React, { PropTypes } from 'react';
import { Row, Col } from 'reactstrap';

import { getFullNameOrEmail } from '/imports/api/users/helpers';
import { getFormattedDate } from '/imports/share/helpers';
import { AnalysisStatuses } from '/imports/share/constants.js';
import { createReadFields } from '/imports/ui/react/helpers';

const propTypes = {
  executor: PropTypes.object,
  targetDate: PropTypes.instanceOf(Date),
  status: PropTypes.number,
  completedAt: PropTypes.instanceOf(Date),
  completedBy: PropTypes.object,
  completionComments: PropTypes.string,
  children: PropTypes.node,
};

const Analysis = ({
  executor,
  targetDate,
  status,
  completedAt,
  completedBy,
  completionComments,
  children,
}) => {
  if (!executor && !targetDate) return null;

  const render = (field) => (<Col sm="6">{field}</Col>);
  const data = [
    { label: 'Status', text: AnalysisStatuses[status] },
    { label: 'Who will do it?', text: executor && getFullNameOrEmail(executor), render },
    { label: 'Target date', text: targetDate && getFormattedDate(targetDate), render },
    { label: 'Completed date', text: completedAt && getFormattedDate(completedAt), render },
    { label: 'Completed by', text: completedBy && getFullNameOrEmail(completedBy), render },
    { label: 'Comments', text: completionComments },
  ];
  const fields = createReadFields(data);

  return (
    <div>
      {fields.status}

      <Row>
        {fields['whoWillDoIt?']}
        {fields.targetDate}
      </Row>

      <Row>
        {fields.completedDate}
        {fields.completedBy}
      </Row>

      {fields.comments}

      {children}
    </div>
  );
};

Analysis.propTypes = propTypes;

export default Analysis;
