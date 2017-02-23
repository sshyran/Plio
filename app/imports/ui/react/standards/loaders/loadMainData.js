import { batchActions } from 'redux-batched-actions';

import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import { Standards } from '/imports/share/collections/standards';
import {
  setStandardBookSections,
  setStandardTypes,
  setStandards,
} from '/imports/client/store/actions/collectionsActions';

export default function loadMainData({ dispatch, organizationId }, onData = () => null) {
  const query = { organizationId };
  const options = { sort: { title: 1 } };
  const sections = StandardsBookSections.find(query, options).fetch();
  const types = StandardTypes.find(query, options).fetch();
  const standards = Standards.find(query, options).fetch();

  const actions = [
    setStandardBookSections(sections),
    setStandardTypes(types),
    setStandards(standards),
  ];

  dispatch(batchActions(actions));

  onData(null, {});
}
