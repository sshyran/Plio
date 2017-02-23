import React, { PropTypes } from 'react';
import { ListGroupItemHeading } from 'reactstrap';

import Table from '/imports/ui/react/components/Table';
import Label from '/imports/ui/react/components/Labels/Label';
import { getFullName } from '/imports/api/users/helpers';

const ScoringTable = ({
  scores = [],
  header = [
    'Score type',
    'Score',
    'Scored date',
    'Scored by',
  ],
  ...other
}) => (
  <Table {...{ header, ...other }}>
    {scores.map(score => [
      <ListGroupItemHeading tag="span">{score.scoreTypeId}</ListGroupItemHeading>,
      <div>
        <Label margin="right" className={`impact-${score.className}`}>{score.value}</Label>
        <ListGroupItemHeading tag="span" className="margin-right">
          {score.priority}
        </ListGroupItemHeading>
      </div>,
      <ListGroupItemHeading tag="span">{score.scoredAt}</ListGroupItemHeading>,
      <ListGroupItemHeading tag="span">
        {getFullName(score.scoredBy)}
      </ListGroupItemHeading>,
    ])}
  </Table>
);

ScoringTable.propTypes = {
  header: Table.propTypes.header,
  scores: PropTypes.arrayOf(PropTypes.object),
};

export default ScoringTable;
