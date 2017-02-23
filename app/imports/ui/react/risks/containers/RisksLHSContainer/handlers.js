import { extractIds } from '/imports/api/helpers';
import {
  expandCollapsedRisks,
  collapseExpandedRisks,
} from '../../helpers';
import _modal_ from '/imports/startup/client/mixins/modal';
import {
  setFilteredRisks,
} from '/imports/client/store/actions/risksActions';
import { onSearchTextClear, onSearch } from '/imports/ui/react/share/LHS/handlers';

const getItems = ({ risks }, search) =>
  extractIds(search(['title', 'sequentialId'], risks));

const getActions = (ids) => [setFilteredRisks(ids)];

export const onSearchTextChange =
  onSearch(getItems, getActions, expandCollapsedRisks, collapseExpandedRisks);

export const onClear = onSearchTextClear(onSearchTextChange);

export const onModalOpen = () => () => _modal_.modal.open({
  _title: 'Risk',
  template: 'Risks_Create',
  variation: 'save',
});
