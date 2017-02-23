import { connect } from 'react-redux';

import BodyContents from '../../components/RHS/BodyContents';
import { pickDocuments } from '/imports/api/helpers';

const mapStateToProps = (({ collections }, {
  sectionId,
  typeId,
  owner,
  notify,
  improvementPlan = {},
}) => ({
  section: collections.standardBookSectionsByIds[sectionId],
  type: collections.standardTypesByIds[typeId],
  owner: collections.usersByIds[owner],
  improvementPlan: {
    ...improvementPlan,
    owner: collections.usersByIds[improvementPlan.owner],
  },
  notify: pickDocuments(['_id', 'profile', 'emails'], collections.usersByIds, notify),
}));

export default connect(mapStateToProps)(BodyContents);
