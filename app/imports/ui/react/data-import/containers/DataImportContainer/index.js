import { compose, withHandlers, renameProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { pickDeep, pickFrom, combineObjects } from '/imports/api/helpers';

import { setOrgsCollapsed } from '/imports/client/store/actions/dataImportActions';
import { onToggleCollapse, onOrgClick } from './handlers';
import DataImport from '../../components/DataImport';

const enhance = compose(
  connect(combineObjects([
    pickDeep(['global.userId', 'organizations.organizationId']),
    pickFrom('dataImport', ['isLoading', 'isLoaded', 'ownOrganizations', 'areOrgsCollapsed']),
  ])),
  renameProps({
    areOrgsCollapsed: 'collapsed',
    isLoading: 'loading',
  }),
  withHandlers({ onToggleCollapse, onOrgClick }),
  lifecycle({
    componentWillUnmount() {
      this.props.dispatch(setOrgsCollapsed(true));
    },
  }),
);

export default enhance(DataImport);
