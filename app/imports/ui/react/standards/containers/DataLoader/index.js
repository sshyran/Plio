import { composeWithTracker, compose as kompose } from 'react-komposer';
import {
  compose,
  lifecycle,
  shouldUpdate,
  defaultProps,
  withHandlers,
  branch,
  renderComponent,
  renameProp,
} from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import StandardsLayout from '../../components/Layout';
import loadStandardsLayoutData from '../../loaders/loadLayoutData';
import { pickDeep, identity, invokeStop, combineObjects, pickFrom } from '/imports/api/helpers';
import { StandardFilters } from '/imports/api/constants';
import onHandleFilterChange from '../../../handlers/onHandleFilterChange';
import onHandleReturn from '../../../handlers/onHandleReturn';
import loadInitialData from '../../../loaders/loadInitialData';
import loadUsersData from '../../../loaders/loadUsersData';
import loadIsDiscussionOpened from '../../../loaders/loadIsDiscussionOpened';
import loadMainData from '../../loaders/loadMainData';
import loadCardData from '../../loaders/loadCardData';
import loadDeps from '../../loaders/loadDeps';
import {
  observeStandards,
  observeStandardBookSections,
  observeStandardTypes,
} from '../../observers';
import { setInitializing } from '/imports/client/store/actions/standardsActions';

export default compose(
  connect(),
  defaultProps({ filters: StandardFilters }),
  kompose(loadIsDiscussionOpened),
  composeWithTracker(loadInitialData, null, null, {
    shouldResubscribe: false,
  }),
  connect(pickDeep([
    'global.filter',
    'organizations.orgSerialNumber',
    'dataImport.isInProgress',
  ])),
  loadStandardsLayoutData,
  connect(pickDeep(['global.dataLoading'])),
  renameProp('dataLoading', 'loading'),
  branch(
    property('loading'),
    renderComponent(StandardsLayout),
    identity,
  ),
  composeWithTracker(loadUsersData),
  connect(pickDeep(['organizations.organizationId'])),
  lifecycle({
    componentWillMount() {
      loadMainData(this.props, () => null);
    },
  }),
  connect(pickDeep(['organizations.organizationId', 'global.urlItemId'])),
  composeWithTracker(loadCardData, null, null, {
    shouldResubscribe: (props, nextProps) => !!(
      props.organizationId !== nextProps.organizationId ||
      props.urlItemId !== nextProps.urlItemId
    ),
  }),
  connect(pickDeep(['organizations.organizationId', 'standards.initializing'])),
  composeWithTracker(loadDeps, null, null, {
    shouldResubscribe: (props, nextProps) =>
      props.organizationId !== nextProps.organizationId ||
      props.initializing !== nextProps.initializing,
  }),
  connect(combineObjects([
    pickFrom('standards', ['areDepsReady', 'initializing']),
    pickDeep(['global.dataLoading']),
  ])),
  lifecycle({
    componentWillReceiveProps({
      dataLoading,
      areDepsReady,
      initializing,
      dispatch,
      organizationId,
    }) {
      if (!dataLoading && areDepsReady && initializing) {
        setTimeout(() => {
          const args = [dispatch, { organizationId }];
          this.observers = [
            observeStandards(...args),
            observeStandardBookSections(...args),
            observeStandardTypes(...args),
          ];
        }, 0);

        dispatch(setInitializing(false));
      }
    },
    componentWillUnmount() {
      return this.observers && this.observers.map(invokeStop);
    },
  }),
  connect(state => ({
    standard: state.collections.standardsByIds[state.global.urlItemId],
    ...pickDeep([
      'organizations.organization',
      'organizations.orgSerialNumber',
      'discussion.isDiscussionOpened',
      'global.urlItemId',
      'global.filter',
    ])(state),
  })),
  shouldUpdate((props, nextProps) => !!(
    props.isDiscussionOpened !== nextProps.isDiscussionOpened ||
    props.loading !== nextProps.loading ||
    typeof props.organization !== typeof nextProps.organization ||
    props.orgSerialNumber !== nextProps.orgSerialNumber ||
    props.filter !== nextProps.filter
  )),
  connect(pickDeep(['window.width', 'mobile.showCard'])),
  withHandlers({
    onHandleFilterChange,
    onHandleReturn,
  }),
)(StandardsLayout);
