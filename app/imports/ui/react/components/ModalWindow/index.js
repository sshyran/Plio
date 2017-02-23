import React, { PropTypes } from 'react';
import { $ } from 'meteor/jquery';
import { pure } from 'recompose';
import { _ } from 'meteor/underscore';

import Modal from '../Modal';
import { setModal, onModalClose } from '/imports/client/store/actions/modalActions';

const propTypes = {
  variation: PropTypes.oneOf(['save', 'simple', null, undefined]),
  helpContent: PropTypes.node,
  onToggleHelpPanel: PropTypes.func,
  isHelpPanelCollapsed: PropTypes.bool,
  isSaving: PropTypes.bool,
  title: PropTypes.string.isRequired,
  submitCaptionText: PropTypes.string,
  submitCaptionTextOnSave: PropTypes.string,
  closeCaptionTextOnSave: PropTypes.string,
  closeCaptionText: PropTypes.string,
  errorText: PropTypes.string,
  children: PropTypes.node,
  dispatch: PropTypes.func,
  closePortal: PropTypes.func.isRequired,
  onModalClose: PropTypes.func,
};

const defaultProps = {
  variation: null,
  isSaving: false,
  isHelpPanelCollapsed: true,
  errorText: '',
  submitCaptionText: 'Save',
  submitCaptionTextOnSave: 'Saving...',
  closeCaptionText: 'Close',
  closeCaptionTextOnSave: 'Saving...',
  onModalClose: () => null,
};

@pure
class ModalWindow extends React.Component {
  constructor(props) {
    super(props);

    this._closeModal = this._closeModal.bind(this);
    this.onModalClose = props.onModalClose.bind(this);
    this.closePortal = props.closePortal.bind(this);
    this.toggleHelpPanel = _.throttle(props.onToggleHelpPanel, 400).bind(this);
  }

  componentDidMount() {
    this._mounted = true;

    this.props.dispatch(setModal(this.modalRef));

    $(this.modalRef).modal('show');
    $(this.modalRef).on('hidden.bs.modal', (e) => {
      if (this._mounted) this.closePortal();

      if (typeof this.onModalClose === 'function') this.onModalClose(e);

      return this;
    });

    const oldOnpopstate = window.onpopstate;

    window.onpopstate = (e) => {
      this._closeModal();

      if (typeof oldOnpopstate === 'function') oldOnpopstate(e);

      window.onpopstate = oldOnpopstate;
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.errorText && !prevProps.errorText ||
        (this.props.errorText && prevProps.errorText &&
        this.props.errorText !== prevProps.errorText)) {
      $(this.modalRef).animate({ scrollTop: 0 }, 250, 'swing');
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    this.props.dispatch(onModalClose);
    this._closeModal();
  }

  _getSubmitCaptionText() {
    const { isSaving, submitCaptionTextOnSave, submitCaptionText } = this.props;

    return isSaving && submitCaptionTextOnSave
      ? submitCaptionTextOnSave
      : submitCaptionText;
  }

  _getCloseCaptionText() {
    const { isSaving, variation, closeCaptionText, closeCaptionTextOnSave } = this.props;

    return isSaving && variation === 'save' ? closeCaptionTextOnSave : closeCaptionText;
  }

  _closeModal() {
    $(this.modalRef).modal('hide');
  }

  render() {
    return (
      <Modal
        {...this.props}
        onToggleHelpPanel={this.toggleHelpPanel}
        submitCaptionText={this._getSubmitCaptionText()}
        closeCaptionText={this._getCloseCaptionText()}
        modalRefCb={modalRef => (this.modalRef = modalRef)}
        onModalClose={this._closeModal}
      >
        {this.props.children}
      </Modal>
    );
  }
}

ModalWindow.propTypes = propTypes;
ModalWindow.defaultProps = defaultProps;

export default ModalWindow;
