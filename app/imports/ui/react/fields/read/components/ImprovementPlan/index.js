import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import property from 'lodash.property';

import Block from '../Block';
import FileProvider from '../../../../containers/providers/FileProvider';
import createReadFields from '../../../../helpers/createReadFields';
import { getFormattedDate } from '/imports/share/helpers';
import { getFullNameOrEmail } from '/imports/api/users/helpers';
import { mapC, compose, sortC, join, getC } from '/imports/api/helpers';

const renderReviewDates = compose(
  join(', '),
  sortC((d1, d2) => new Date(d1) - new Date(d2)),
  mapC(compose(getFormattedDate, property('date'))),
);

const renderFields = ({
  desiredOutcome,
  targetDate,
  owner,
  reviewDates,
  fileIds,
}) => {
  const data = [
    { label: 'Statement of desired outcome', text: desiredOutcome },
    {
      label: 'Target date for desired outcome',
      text: targetDate && getFormattedDate(targetDate),
    },
    {
      label: 'Improvement plan review dates',
      text: !!reviewDates.length && renderReviewDates(reviewDates),
    },
    { label: 'Owner', text: getFullNameOrEmail(owner) },
    {
      label: 'Means statement',
      text: !!fileIds.length && fileIds.map(fileId => (
        <FileProvider key={fileId} fileId={fileId} />
      )),
    },
  ];

  return _.values(createReadFields(data)).map((field, i) => ({
    ...field,
    key: getC('label', data[i]) || i,
  }));
};

const ImprovementPlan = ({
  label = 'Improvement plan',
  desiredOutcome,
  targetDate,
  owner,
  reviewDates = [],
  fileIds = [],
}) => (
  !!(desiredOutcome || targetDate || owner || reviewDates.length || fileIds.length) ? (
    <Block>
      {label}
      {[...renderFields({ desiredOutcome, targetDate, owner, reviewDates, fileIds })]}
    </Block>
  ) : null
);

ImprovementPlan.propTypes = {
  label: PropTypes.string.isRequired,
  desiredOutcome: PropTypes.string,
  targetDate: PropTypes.instanceOf(Date),
  owner: PropTypes.object,
  reviewDates: PropTypes.arrayOf(PropTypes.shape({ date: PropTypes.instanceOf(Date) })),
  fileIds: PropTypes.arrayOf(PropTypes.string),
};

export default ImprovementPlan;
