import React, { PropTypes } from 'react';
import Portal from 'react-portal';

import ModalWindowContainer from '../../containers/ModalWindowContainer';

const ModalHandle = ({
  closeOnEsc = false,
  closeOnOutsideClick = false,
  openByClickOn,
  isOpened,
  children,
  ...props
}) => (
  <Portal {...{ closeOnEsc, closeOnOutsideClick, openByClickOn, isOpened }}>
    <ModalWindowContainer {...props}>
      {children}
    </ModalWindowContainer>
  </Portal>
);

ModalHandle.propTypes = {
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  openByClickOn: PropTypes.element,
  isOpened: PropTypes.bool,
  children: PropTypes.node,
};

export default ModalHandle;
