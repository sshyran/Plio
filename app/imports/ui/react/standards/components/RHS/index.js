import React, { PropTypes } from 'react';
import cx from 'classnames';

import { CollectionNames } from '/imports/share/constants';
import { getId } from '/imports/api/helpers';
import RHS from '../../../components/RHS';
import HeaderButtons from './HeaderButtons';
import Body from './Body';
import NoResults from './NoResults';
import NotFound from './NotFound';
import NotExist from './NotExist';
import RHSHeaderButtonsContainer from '../../containers/RHSHeaderButtonsContainer';
import RHSBodyContainer from '../../containers/RHSBodyContainer';
import ChangelogContainer from '../../../changelog/containers/ChangelogContainer';

const StandardsRHS = ({
  isFullScreenMode,
  standard,
  isReady = true,
  hasDocxAttachment,
}) => (
  <RHS
    flex
    className={cx('expandable', {
      expanded: isFullScreenMode,
    })}
  >
    <RHS.Card className="document-details">
      <RHS.Header
        title="Standard"
        isReady={isReady}
      >
        <RHSHeaderButtonsContainer {...{ standard, hasDocxAttachment }} />
      </RHS.Header>

      <RHS.ContentList isReady={isReady}>
        <RHSBodyContainer {...{ standard, hasDocxAttachment }} />
        <ChangelogContainer
          documentId={getId(standard)}
          collection={CollectionNames.STANDARDS}
        />
      </RHS.ContentList>
    </RHS.Card>
  </RHS>
);

StandardsRHS.propTypes = {
  hasDocxAttachment: PropTypes.bool,
  isFullScreenMode: PropTypes.bool,
  standard: PropTypes.object,
  isReady: PropTypes.bool,
};

StandardsRHS.HeaderButtons = HeaderButtons;
StandardsRHS.Body = Body;
StandardsRHS.NotFound = NotFound;
StandardsRHS.NotExist = NotExist;
StandardsRHS.NoResults = NoResults;

export default StandardsRHS;
