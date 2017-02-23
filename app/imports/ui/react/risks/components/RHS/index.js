import React, { PropTypes } from 'react';
import cx from 'classnames';

import { CollectionNames } from '/imports/share/constants';
import { getId } from '/imports/api/helpers';
import RHS from '../../../components/RHS';
import HeaderButtons from './HeaderButtons';
import Body from './Body';
import NotFound from './NotFound';
import NotExist from './NotExist';
import RHSHeaderButtonsContainer from '../../containers/RHSHeaderButtonsContainer';
import RHSBodyContainer from '../../containers/RHSBodyContainer';
import ChangelogContainer from '../../../changelog/containers/ChangelogContainer';

const RisksRHS = ({
  isFullScreenMode,
  risk,
  isReady = true,
}) => (
  <RHS
    className={cx('expandable', {
      expanded: isFullScreenMode,
    })}
  >
    <RHS.Card className="document-details">
      <RHS.Header
        title="Risk"
        isReady={isReady}
      >
        <RHSHeaderButtonsContainer {...{ risk }} />
      </RHS.Header>

      <RHS.ContentList isReady={isReady}>
        <RHSBodyContainer {...{ risk }} />
        <ChangelogContainer
          documentId={getId(risk)}
          collection={CollectionNames.RISKS}
        />
      </RHS.ContentList>
    </RHS.Card>
  </RHS>
);

RisksRHS.propTypes = {
  hasDocxAttachment: PropTypes.bool,
  isFullScreenMode: PropTypes.bool,
  risk: PropTypes.object,
  isReady: PropTypes.bool,
};

RisksRHS.HeaderButtons = HeaderButtons;
RisksRHS.Body = Body;
RisksRHS.NotFound = NotFound;
RisksRHS.NotExist = NotExist;

export default RisksRHS;
