import React, { PropTypes } from 'react';

import { getFullNameOrEmail } from '/imports/api/users/helpers';
import { getFormattedDate } from '/imports/share/helpers';
import { mapC } from '/imports/api/helpers';
import Field from '../Field';

const renderReviews = mapC(({ _id, reviewedAt, reviewedBy, comments }) => (
  <Field key={_id}>
    <span>Document reviewed</span>
    {reviewedBy && <span> by {getFullNameOrEmail(reviewedBy)}</span>}
    {reviewedAt && <span> on {getFormattedDate(reviewedAt)}</span>}
    {comments && <span> with comments "{comments}"</span>}
  </Field>
));

const Reviews = ({ reviews }) => (<div>{renderReviews(reviews)}</div>);

Reviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    reviewedAt: PropTypes.instanceOf(Date),
    reviewedBy: PropTypes.object,
    comments: PropTypes.string,
  })),
};

export default Reviews;
