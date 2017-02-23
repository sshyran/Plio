import React from 'react';
import { mapProps } from 'recompose';

import RisksLHSContainer from '../../containers/RisksLHSContainer';
import RisksRHSContainer from '../../containers/RisksRHSContainer';

import PageContainer from '../../../containers/PageContainer';
import NotFoundPage from '../../../components/NotFoundPage';
import DiscussionContainer from '../../../discussion/containers/DiscussionContainer';

const enhance = mapProps(props => (
  props.isDiscussionOpened ? ({
    ...props,
    doc: props.risk,
    classNames: {
      lhs: 'content-cards scroll',
      rhs: 'content-cards content-cards-flush scroll',
    },
  }) : props
));

const RisksPage = enhance((props) => (
  props.organization ? (
    <PageContainer classNames={props.classNames}>
      {(!props.isDiscussionOpened ? ([
        <RisksLHSContainer key="risks-lhs-container" />,
        <RisksRHSContainer key="risks-rhs-container" />,
      ]) : ([
        <RisksRHSContainer key="risks-rhs-container" />,
        <DiscussionContainer key="discussion-container" {...props} />,
      ]))}
    </PageContainer>
  ) : (
    <NotFoundPage
      subject="organization"
      subjectId={props.orgSerialNumber}
    />
  )
));

export default RisksPage;
