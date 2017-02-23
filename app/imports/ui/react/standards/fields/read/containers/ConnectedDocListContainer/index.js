import { compose, setPropTypes, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { PropTypes } from 'react';
import property from 'lodash.property';

import {
  every,
  notDeleted,
  includes,
  propEqId,
  pickC,
  find,
  filterC,
} from '/imports/api/helpers';
import { DocumentTypes } from '/imports/share/constants';
import ConnectedDocList from '../../components/ConnectedDocList';
import { getLinkedLessons, getLinkedActions } from '/imports/ui/react/share/helpers/linked';

export default compose(
  setPropTypes({
    standardId: PropTypes.string.isRequired,
  }),
  connect(() => (state) => ({
    ...pickC(['userId'], state.global),
    ...pickC([
      'ncs', 'risks', 'actions', 'lessons', 'workItems',
    ], state.collections),
  })),
  mapProps((props) => {
    const filterProblems = filterC(every([
      notDeleted,
      compose(includes(props.standardId), property('standardsIds')),
    ]));
    const ncs = filterProblems(props.ncs);
    const risks = filterProblems(props.risks);
    const predicate = every([
      notDeleted,
      compose(
        find(({ documentId }) => find(
          propEqId(documentId),
          ncs.concat(risks),
        )),
        property('linkedTo'),
      ),
    ]);
    const actions = getLinkedActions(predicate, props, props.actions);
    const lessons = getLinkedLessons(props.standardId, DocumentTypes.STANDARD, props.lessons);

    return { ...props, ncs, risks, actions, lessons };
  })
)(ConnectedDocList);
