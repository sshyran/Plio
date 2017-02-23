import { Meteor } from 'meteor/meteor';
import {
  compose,
  defaultProps,
  withHandlers,
  lifecycle,
  branch,
  renderComponent,
  shouldUpdate,
} from 'recompose';
import { connect } from 'react-redux';
import { composeWithTracker, compose as kompose } from 'react-komposer';
import { setInitializing } from '/imports/client/store/actions/risksActions';
import { pickDeep, mapC, invokeStop, identity } from '/imports/api/helpers';
import { RiskFilters, RiskFilterIndexes } from '/imports/api/constants';
import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers';
import RisksLayout from '../../components/RisksLayout';
import onHandleFilterChange from '../../../handlers/onHandleFilterChange';
import onHandleReturn from '../../../handlers/onHandleReturn';
import loadDeps from '../../loaders/loadDeps';
import loadCardData from '../../loaders/loadCardData';
import loadMainData from '../../loaders/loadMainData';
import loadLayoutData from '../../../loaders/loadLayoutData';
import loadInitialData from '../../../loaders/loadInitialData';
import loadUsersData from '../../../loaders/loadUsersData';
import loadIsDiscussionOpened from '../../../loaders/loadIsDiscussionOpened';
import { observeRisks, observeRiskTypes } from '../../observers';

const getLayoutData = () => loadLayoutData(({ filter, orgSerialNumber }) => {
  const isDeleted = filter === RiskFilterIndexes.DELETED
    ? true
    : { $in: [null, false] };

  return DocumentLayoutSubs.subscribe('risksLayout', orgSerialNumber, isDeleted);
});


const enhance = compose(
  connect(),
  defaultProps({ filters: RiskFilters }),
  kompose(loadIsDiscussionOpened),
  composeWithTracker(loadInitialData, null, null, {
    shouldResubscribe: false,
  }),
  connect(pickDeep([
    'global.filter',
    'organizations.orgSerialNumber',
  ])),
  composeWithTracker(
    getLayoutData(),
    null,
    null,
    {
      shouldResubscribe: (props, nextProps) =>
      props.orgSerialNumber !== nextProps.orgSerialNumber || props.filter !== nextProps.filter,
    }
  ),
  branch(
    props => props.loading,
    renderComponent(RisksLayout),
    identity
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
    shouldResubscribe: (props, nextProps) => Boolean(
      props.organizationId !== nextProps.organizationId ||
      props.urlItemId !== nextProps.urlItemId
    ),
  }),
  connect(pickDeep(['organizations.organizationId', 'risks.initializing'])),
  composeWithTracker(loadDeps, null, null, {
    shouldResubscribe: (props, nextProps) =>
    props.organizationId !== nextProps.organizationId ||
    props.initializing !== nextProps.initializing,
  }),
  connect(pickDeep(['global.dataLoading', 'risks.areDepsReady', 'risks.initializing'])),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (!nextProps.dataLoading && nextProps.initializing && nextProps.areDepsReady) {
        const { dispatch, organizationId } = nextProps;

        Meteor.defer(() => {
          const args = [dispatch, { organizationId }];
          this.observers = [
            observeRisks(...args),
            observeRiskTypes(...args),
          ];
        });

        dispatch(setInitializing(false));
      }
    },
    componentWillUnmount() {
      const result = this.observers && mapC(invokeStop, this.observers);

      this.props.dispatch(setInitializing(true));

      return result;
    },
  }),
  connect(state => ({
    risk: state.collections.risksByIds[state.global.urlItemId],
    ...pickDeep([
      'organizations.organization',
      'organizations.orgSerialNumber',
      'discussion.isDiscussionOpened',
      'global.urlItemId',
      'global.filter',
    ])(state),
  })),
  shouldUpdate((props, nextProps) => Boolean(
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
);

export default enhance(RisksLayout);
