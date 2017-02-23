import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ActionTypes } from '/imports/share/constants.js';
import { UncategorizedTypeSection, AnalysisTitles } from '/imports/api/constants.js';
import { RiskTypes } from '/imports/share/collections/risk-types.js';
import { restore, remove } from '/imports/api/risks/methods.js';
import { RisksHelp } from '/imports/api/help-messages.js';

Template.Risks_Card_Read.viewmodel({
  share: 'search',
  mixin: [
    'organization', 'risk', 'problemsStatus',
    'utils', 'user', 'date',
    'modal', 'router', 'collapsing',
    'workInbox',
  ],
  isReadOnly: false,
  isReady: false,
  RiskRCALabel: AnalysisTitles.riskAnalysis,
  RiskUOSLabel: AnalysisTitles.updateOfRiskRecord,
  showCard() {
    return this.risks().length && !this.noSearchResults();
  },
  ActionTypes() {
    return ActionTypes;
  },
  risks() {
    const organizationId = this.organizationId();
    const query = this.isActiveRiskFilter(4)
      ? { isDeleted: true }
      : { isDeleted: { $in: [null, false] } };

    return this._getRisksByQuery({ organizationId, ...query }).fetch();
  },
  risk() {
    return this._getRiskByQuery({ _id: this._id() });
  },
  type() {
    const risk = Object.assign({}, this.risk());
    const type = RiskTypes.findOne({ _id: risk.typeId });
    return type || UncategorizedTypeSection;
  },
  openEditModal() {
    this.modal().open({
      _title: 'Risk',
      helpText: RisksHelp.risk,
      template: 'Risks_Card_Edit',
      _id: this.risk() && this.risk()._id,
    });
  },
  pathToDiscussion() {
    const params = {
      orgSerialNumber: this.organizationSerialNumber(),
      riskId: this.riskId(),
    };
    const queryParams = { filter: this.activeRiskFilterId() };
    return FlowRouter.path('riskDiscussion', params, queryParams);
  },
  restore({ _id, title, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        FlowRouter.setQueryParams({ filter: 1 });
        Meteor.setTimeout(() => {
          this.goToRisk(_id);
          this.expandCollapsed(_id);
        }, 0);
      });
    };

    restore.call({ _id }, callback);
  },
  delete({ _id, title, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => cb(err, () => this.handleRouteRisks());

    remove.call({ _id }, callback);
  },
  noSearchResults() {
    return this.searchText() && !this.searchResult().array().length;
  },
});
