import { FlowRouter } from 'meteor/kadira:flow-router';
import { batchActions } from 'redux-batched-actions';
import { setSearchText, setFilter } from '/imports/client/store/actions/globalActions';

const onHandleFilterChange = props => index => {
  const filter = parseInt(Object.keys(props.filters)[index], 10);
  const actions = [
    setSearchText(''),
    setFilter(filter),
  ];

  FlowRouter.setQueryParams({ filter });

  props.dispatch(batchActions(actions));
};

export default onHandleFilterChange;
