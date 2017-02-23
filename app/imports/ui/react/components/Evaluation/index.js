import React, { PropTypes } from 'react';
import { Row, Col } from 'reactstrap';

import Field from '../../fields/read/components/Field';

const Evaluation = ({
  comments,
  prevLossExp,
  decision,
  priority,
  labels: {
    comments: commentsLabel = 'Comments',
    prevLossExp: prevLossExpLabel = 'Previous loss experience',
    decision: decisionLabel = 'Treatment decision',
    priority: treatmentPriority = 'Treatment priority',
  } = {},
}) => (
  <div>
    {comments && (<Field label={commentsLabel}>{comments}</Field>)}

    {prevLossExp && (
      <Field label={prevLossExpLabel}>
        {prevLossExp}
      </Field>
    )}

    {(decision || priority) && (
      <Row>
        {decision && (
          <Col sm={decision && priority ? 6 : 12}>
            <Field label={decisionLabel}>{decision}</Field>
          </Col>
        )}

        {priority && (
          <Col sm={decision && priority ? 6 : 12}>
            <Field label={treatmentPriority}>{priority}</Field>
          </Col>
        )}
      </Row>
    )}
  </div>
);

const prop = PropTypes.oneOfType([PropTypes.string, PropTypes.node]);

Evaluation.propTypes = {
  comments: prop,
  prevLossExp: prop,
  decision: prop,
  priority: prop,
  labels: PropTypes.object,
};

export default Evaluation;
