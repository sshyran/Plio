import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { PropTypes } from 'react';

import loadLayoutData from '../../loaders/loadLayoutData';
import { setInitializing } from '/imports/client/store/actions/standardsActions';
import { invokeStop } from '/imports/api/helpers';

const getLayoutData = (props) => loadLayoutData(() => {
  if (!props.orgSerialNumber) return false;

  const isDeleted = props.filter === 3
          ? true
          : { $in: [null, false] };

  return Meteor.subscribe('standardsLayout', props.orgSerialNumber, isDeleted);
})(props, () => null);

const propTypes = {
  isInProgress: PropTypes.bool,
  filter: PropTypes.number,
  orgSerialNumber: PropTypes.number,
};

// BUG: Create org => import standards => delete org => enter other org =>
// observers are not running and the docx docs are not loading and rendering

const loadStandardsLayoutData = (Component) => {
  class LoadStandardsLayoutData extends React.Component {
    componentWillMount() {
      this._subscribe(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (!this.props.isInProgress && nextProps.isInProgress) {
        this._unsubscribe();
        nextProps.dispatch(setInitializing(true));
      } else this._subscribe(nextProps, this.props);
    }

    shouldComponentUpdate(nextProps) {
      return !!(
        this.props.filter !== nextProps.filter ||
        this.props.orgSerialNumber !== nextProps.orgSerialNumber ||
        this.props.isInProgress !== nextProps.isInProgress
      );
    }

    componentWillUnmount() {
      this._unsubscribe();
    }

    _subscribe(props) {
      this._unsubscribe();

      this.handler = Tracker.nonreactive(() =>
        Tracker.autorun(() => {
          this.cleanup = getLayoutData(props);
        }));
    }

    _unsubscribe() {
      if (typeof this.cleanup === 'function') this.cleanup();

      if (this.handler) invokeStop(this.handler);
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  LoadStandardsLayoutData.propTypes = propTypes;

  return LoadStandardsLayoutData;
};

export default loadStandardsLayoutData;
