import { compose, mapProps, setPropTypes, branch, renderNothing } from 'recompose';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import property from 'lodash.property';

import { length, pickFrom, assoc, slice, mapC, identity } from '/imports/api/helpers';
import { getLinkedReviews } from '/imports/ui/react/share/helpers/linked';
import { DocumentTypes } from '/imports/share/constants';
import Block from '/imports/ui/react/fields/read/components/Block';
import Reviews from '../../components/Reviews';

const ReviewsContainer = ({ label = 'Reviews', ...props }) => (
  <Block>
    {label}
    <Reviews {...props} />
  </Block>
);

ReviewsContainer.propTypes = { label: PropTypes.string };

const mapReview = ({ usersByIds }) => mapC((review) =>
  assoc('reviewedBy', usersByIds[review.reviewedBy], review));

const mapReviews = ({ sliceCount = 3, ...props }) => compose(
  reviews => assoc('reviews', reviews, props),
  mapReview(props), // replace 'reviewedBy' with the actual user object instead of id
  getLinkedReviews(props.documentId, props.documentType), // get reviews linked to that document
  slice(0, sliceCount), // get the last 3 reviews
)(props.reviews);

export default compose(
  setPropTypes({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    documentId: PropTypes.string,
    documentType: PropTypes.oneOf(Object.values(DocumentTypes)),
    sliceCount: PropTypes.number,
  }),
  connect(pickFrom('collections', ['reviews', 'usersByIds'])),
  mapProps(mapReviews),
  branch(
    compose(length, property('reviews')),
    identity,
    renderNothing
  )
)(ReviewsContainer);
