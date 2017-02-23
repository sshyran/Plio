import { connect } from 'react-redux';
import { compose } from 'recompose';

import { pickDeep } from '/imports/api/helpers';
import RisksList from '../../components/RisksList';

export default compose(
  connect(pickDeep([
    'organizations.organization',
    'organizations.orgSerialNumber',
    'global.userId',
    'global.filter',
    'global.urlItemId',
  ])),
)(RisksList);
