import { PropTypes } from 'react';

export default {
  filter: PropTypes.number,
  collapsed: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    type: PropTypes.string,
  })),
  sections: PropTypes.arrayOf(PropTypes.object),
  types: PropTypes.arrayOf(PropTypes.object),
  risks: PropTypes.arrayOf(PropTypes.object),
  orgSerialNumber: PropTypes.number,
  onSectionToggleCollapse: PropTypes.func,
  onTypeToggleCollapse: PropTypes.func,
  animating: PropTypes.bool,
  searchText: PropTypes.string,
  searchResultsText: PropTypes.string,
  onSearchTextChange: PropTypes.func,
  onClear: PropTypes.func,
  onModalButtonClick: PropTypes.func,
};
