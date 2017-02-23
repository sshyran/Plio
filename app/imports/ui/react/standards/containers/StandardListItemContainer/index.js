import { compose, withHandlers, withProps, shouldUpdate, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { getSubNestingClassName } from '../../helpers';
import StandardListItem from '../../components/StandardListItem';
import _user_ from '/imports/startup/client/mixins/user';
import _date_ from '/imports/startup/client/mixins/date';
import { setUrlItemId } from '/imports/client/store/actions/globalActions';
import { updateViewedBy } from '/imports/api/standards/methods';
import withUpdateViewedBy from '../../../helpers/withUpdateViewedBy';
import { pickC, notEquals } from '/imports/api/helpers';
import { STANDARD_FILTER_MAP, UncategorizedTypeSection } from '/imports/api/constants';
import { isNewDoc } from '/imports/api/checkers';
import { getPath } from '/imports/ui/utils/router/paths';

export default compose(
  shouldUpdate((props, nextProps) => !!(
    props.orgSerialNumber !== nextProps.orgSerialNumber ||
    props.userId !== nextProps.userId ||
    (props._id !== props.urlItemId && props._id === nextProps.urlItemId) ||
    (props._id === props.urlItemId && props._id !== nextProps.urlItemId)
  )),
  connect((_, { _id }) => (state) => {
    const standard = { ...state.collections.standardsByIds[_id] };

    return {
      ...standard,
      type: state.collections.standardTypesByIds[standard.typeId] || UncategorizedTypeSection,
    };
  }),
  shouldUpdate((props, nextProps) => {
    const pickKeys = pickC(['title', 'isDeleted', 'unreadMessagesCount', 'userId']);
    const pickKeysDeleted = pickC(['deletedBy', 'deletedAt']);
    const isNewCurrent = isNewDoc(props.organization, props.userId, props);
    const isNewNext = isNewDoc(nextProps.organization, nextProps.userId, nextProps);
    return !!(
      ((!props.nestingLevel || props.nestingLevel <= 1) && nextProps.nestingLevel > 1) ||
      (props.nestingLevel >= 1 && nextProps.nestingLevel < 1) ||
      (props.status === 'draft' && nextProps.status !== 'draft') ||
      (props.status !== 'draft' && nextProps.status === 'draft') ||
      (props._id !== props.urlItemId && props._id === nextProps.urlItemId) ||
      (props._id === props.urlItemId && props._id !== nextProps.urlItemId) ||
      (nextProps.status === 'draft' && props.issueNumber !== nextProps.issueNumber) ||
      ((props.type && props.type.title) !== (nextProps.type && nextProps.type.title)) ||
      isNewCurrent !== isNewNext ||
      notEquals(pickKeys(props), pickKeys(nextProps)) ||
      props.uniqueNumber !== nextProps.uniqueNumber ||
      (nextProps.filter === STANDARD_FILTER_MAP.DELETED && (
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

      return getPath('standard')(params, queryParams);
    })();
    const className = getSubNestingClassName(props);
    const isNew = isNewDoc(props.organization, props.userId, props);
    const deletedByText = _user_.userNameOrEmail(props.deletedBy);
    const deletedAtText = _date_.renderDate(props.deletedAt);
    const isActive = props.urlItemId === props._id;

    return {
      href,
      className,
      isNew,
      deletedByText,
      deletedAtText,
      isActive,
    };
  }),
  withUpdateViewedBy(updateViewedBy),
)(StandardListItem);
