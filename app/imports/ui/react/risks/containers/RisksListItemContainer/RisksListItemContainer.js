import { compose, withHandlers, withProps, shouldUpdate } from 'recompose';
import { connect } from 'react-redux';
import cx from 'classnames';

import RisksListItem from '../../components/RisksListItem';
import { getFormattedDate } from '/imports/share/helpers';
import { getFullNameOrEmail } from '/imports/api/users/helpers';
import { setUrlItemId } from '/imports/client/store/actions/globalActions';
import { updateViewedBy } from '/imports/api/risks/methods';
import withUpdateViewedBy from '../../../helpers/withUpdateViewedBy';
import { pickC, notEquals, getC } from '/imports/api/helpers';
import { RiskFilterIndexes } from '/imports/api/constants';
import { isNewDoc } from '/imports/api/checkers';
import { getPath } from '/imports/ui/utils/router/paths';
import { getClassByScore, getPrimaryScore } from '/imports/api/risks/helpers';
import { getClassByStatus } from '/imports/api/problems/helpers';

export default compose(
  shouldUpdate((props, nextProps) => !!(
    props.orgSerialNumber !== nextProps.orgSerialNumber ||
    props.userId !== nextProps.userId ||
    (props._id !== props.urlItemId && props._id === nextProps.urlItemId) ||
    (props._id === props.urlItemId && props._id !== nextProps.urlItemId)
  )),
  connect((_, { _id }) => (state) => {
    const risk = { ...state.collections.risksByIds[_id] };

    return {
      ...risk,
      deletedBy: state.collections.usersByIds[risk.deletedBy],
    };
  }),
  withProps((props) => ({
    isNew: isNewDoc(props.organization, props.userId, props),
    primaryScore: getPrimaryScore(props.scores),
  })),
  shouldUpdate((props, nextProps) => {
    const pickKeys = pickC([
      'title', 'sequentialId', 'isDeleted',
      'unreadMessagesCount', 'userId', 'isNew',
      'primaryScore',
    ]);
    const pickKeysDeleted = pickC(['deletedAt', 'deletedBy']);
    return !!(
      (props._id !== props.urlItemId && props._id === nextProps.urlItemId) ||
      (props._id === props.urlItemId && props._id !== nextProps.urlItemId) ||
      notEquals(pickKeys(props), pickKeys(nextProps)) ||
      (nextProps.filter === RiskFilterIndexes.DELETED && (
        notEquals(pickKeysDeleted(props), pickKeysDeleted(nextProps))
      ))
    );
  }),
  withHandlers({
    onClick: props => handler => {
      props.dispatch(setUrlItemId(props._id));

      handler({ urlItemId: props._id });
    },
  }),
  withProps((props) => {
    const href = (() => {
      const params = {
        urlItemId: props._id,
        orgSerialNumber: props.orgSerialNumber,
      };
      const queryParams = {
        filter: props.filter || 1,
      };

      return getPath('risk')(params, queryParams);
    })();
    const isNew = isNewDoc(props.organization, props.userId, props);
    const createdAtText = getFormattedDate(props.createdAt);
    const deletedByText = getFullNameOrEmail(props.deletedBy);
    const deletedAtText = getFormattedDate(props.deletedAt);
    const isActive = props.urlItemId === props._id;
    const sequentialId = {
      className: props.filter === RiskFilterIndexes.STATUS
        ? cx('label', `label-${getClassByStatus(props.status)}`)
        : '',
    };
    const primaryScore = {
      className: `impact-${getClassByScore(getC('primaryScore.value', props))}`,
    };

    return {
      href,
      isNew,
      createdAtText,
      deletedByText,
      deletedAtText,
      isActive,
      attrs: { sequentialId, primaryScore },
    };
  }),
  withUpdateViewedBy(updateViewedBy),
)(RisksListItem);
