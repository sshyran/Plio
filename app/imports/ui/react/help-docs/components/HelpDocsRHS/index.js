import React from 'react';
import cx from 'classnames';

import HelpDocsRHSHeaderButtons from '../HelpDocsRHSHeaderButtons';
import HelpDocsRHSBodyContainer from '../../containers/HelpDocsRHSBodyContainer';
import RHS from '../../../components/RHS';
import propTypes from './propTypes';

const HelpDocsRHS = (props) => (
  <RHS
    className={cx('expandable', {
      expanded: props.isFullScreenMode,
    })}
  >
    <RHS.Card className="standard-details">
      <RHS.Header
        title={props.headerTitle}
        isReady={props.isCardReady}
      >

        <HelpDocsRHSHeaderButtons
          hasDocxAttachment={props.hasDocxAttachment}
          onToggleScreenMode={props.onToggleScreenMode}
          onModalOpen={props.onModalOpen}
          userHasChangeAccess={props.userHasChangeAccess}
        />

      </RHS.Header>

      <HelpDocsRHSBodyContainer
        isReady={props.isCardReady}
        helpDoc={props.helpDoc}
        helpDocSection={props.helpDocSection}
        file={props.file}
        hasDocxAttachment={props.hasDocxAttachment}
      />

      <div className="card-footer"></div>

    </RHS.Card>
  </RHS>
);

HelpDocsRHS.propTypes = propTypes;

export default HelpDocsRHS;
