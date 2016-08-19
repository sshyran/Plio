import { Template } from 'meteor/templating';

import { AnalysisStatuses } from '/imports/api/constants.js';

Template.Subcards_RootCauseAnalysis_Read_Item.viewmodel({
  mixin: ['user', 'date', 'utils'],
  getAnalysisStatusName(status = 0) {
    return AnalysisStatuses[status];
  }
});