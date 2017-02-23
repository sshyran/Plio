import { setShowCard } from '/imports/client/store/actions/mobileActions';
import { goTo } from '../../utils/router/actions';
import { MOBILE_BREAKPOINT } from '/imports/api/constants';

const onHandleReturn = (props) => () => {
  const { orgSerialNumber, urlItemId } = props;

  if (props.width <= MOBILE_BREAKPOINT) {
    props.dispatch(setShowCard(false));

    if (props.isDiscussionOpened) {
      return goTo('standard')({ orgSerialNumber, urlItemId });
    } else if (!props.isDiscussionOpened && props.showCard) {
      return true;
    }
  }

  return goTo('dashboardPage')();
};

export default onHandleReturn;

