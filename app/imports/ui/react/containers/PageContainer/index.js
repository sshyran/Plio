import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import { MOBILE_BREAKPOINT } from '/imports/api/constants';
import { setWindowWidth } from '/imports/client/store/actions/windowActions';
import { pickDeep } from '/imports/api/helpers';
import Page from '../../components/Page';

export default compose(
  connect(pickDeep(['window.width', 'mobile.showCard', 'discussion.isDiscussionOpened'])),
  lifecycle({
    componentDidMount() {
      const $window = $(window);
      const getWidth = () => $window.width();
      const setNewWidth = () =>
        this.props.dispatch(setWindowWidth(getWidth()));
      const setNewWidthThrottled = _.throttle(setNewWidth, 500);

      setNewWidth();

      $window.on('resize', setNewWidthThrottled);
    },
  }),
  mapProps(({ width, showCard, isDiscussionOpened, ...props }) => ({
    ...props,
    displayRHS: width <= MOBILE_BREAKPOINT && (showCard || isDiscussionOpened),
    children: _.isFunction(props.children.filter)
      && props.children.filter(child => Boolean(child))
      || props.children,
  })),
)(Page);
