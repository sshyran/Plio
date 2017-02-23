import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import curry from 'lodash.curry';

const withRedirectAndOpen = curry(
  (predicate, connectHandle, handler, { processOnMount = true } = {}) => compose(
    connect(connectHandle),
    lifecycle({
      componentWillMount() {
        if (typeof processOnMount === 'function') {
          if (processOnMount(this.props)) handler(this.props);
        } else if (processOnMount) handler(this.props);
      },
      componentWillReceiveProps(nextProps) {
        if (predicate(this.props, nextProps)) {
          handler(nextProps);
        }
      },
    })
  ),
3);

export default withRedirectAndOpen;
