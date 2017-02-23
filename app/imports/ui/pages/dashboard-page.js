import { Template } from 'meteor/templating';
import pluralize from 'pluralize';

import { CountSubs, BackgroundSubs } from '/imports/startup/client/subsmanagers';
import { updateLastAccessedDate } from '/imports/api/organizations/methods';
import { getC } from '/imports/api/helpers';

Template.Dashboard_Page.viewmodel({
  mixin: ['organization', { 'counter': 'counter' }],
  isReady: false,
  _subHandlers: [],
  autorun: [
    function() {
      const template = this.templateInstance;
      const organizationId = this.organizationId();

      this._subHandlers([
        CountSubs.subscribe('standardsCount', 'standards-count-' + organizationId, organizationId),
        CountSubs.subscribe('standardsNotViewedCount', 'standards-not-viewed-count-' + organizationId, organizationId),
        CountSubs.subscribe('nonConformitiesCount', 'non-conformities-count-' + organizationId, organizationId),
        CountSubs.subscribe('nonConformitiesNotViewedCount', 'non-conformities-not-viewed-count-' + organizationId, organizationId),
        CountSubs.subscribe('workItemsCount', 'work-items-count-' + organizationId, organizationId),
        CountSubs.subscribe('workItemsNotViewedCount', 'work-items-not-viewed-count-' + organizationId, organizationId),
        CountSubs.subscribe('risksCount', 'risks-count-' + organizationId, organizationId),
        CountSubs.subscribe('risksNotViewedCount', 'risks-not-viewed-count-' + organizationId, organizationId)
      ]);

      BackgroundSubs.subscribe('organizationDeps', this.organizationId());
    },
    function () {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  onRendered() {
    const currentOrganization = this.organization();
    const organizationId = this.organizationId();
    const lastAccessedDate = currentOrganization.lastAccessedDate || new Date(0);
    const currentDate = new Date;

    if (lastAccessedDate.toDateString() !== currentDate.toDateString()) {
      updateLastAccessedDate.call({ organizationId });
    }
  },
  _renderMetrics(pluralizeWord = '', totalCount = 0) {

    // Workaround for https://github.com/blakeembrey/pluralize/pull/12
    const lowerCaseLastSChar = (str) => {
      let lastChar = str.substr(str.length - 1);
      if (str.length > 2 && lastChar === 'S') {
        return str.substr(0, str.length - 1) + lastChar.toLowerCase();
      } else {
        return str;
      }
    }

    return this.isReady() ? lowerCaseLastSChar(pluralize(pluralizeWord, totalCount, true)): '';
  },
  standardsViewedCount() {
    return this.counter.get('standards-count-' + this.organizationId());
  },
  standardsNotViewedCount() {
    return this.counter.get('standards-not-viewed-count-' + this.organizationId());
  },
  NCsViewedCount() {
    return this.counter.get('non-conformities-count-' + this.organizationId());
  },
  NCsNotViewedCount() {
    return this.counter.get('non-conformities-not-viewed-count-' + this.organizationId());
  },
  workItemsViewedCount() {
    return this.counter.get('work-items-count-' + this.organizationId());
  },
  workItemsNotViewedCount() {
    return this.counter.get('work-items-not-viewed-count-' + this.organizationId());
  },
  risksViewedCount() {
    return this.counter.get('risks-count-' + this.organizationId());
  },
  risksNotViewedCount() {
    return this.counter.get('risks-not-viewed-count-' + this.organizationId());
  },
  standardsMetrics() {
    return this._renderMetrics('standard', this.standardsViewedCount(), this.standardsNotViewedCount());
  },
  NCsMetrics() {
    return this._renderMetrics('NC', this.NCsViewedCount(), this.NCsNotViewedCount());
  },
  workInboxMetrics() {
    return this._renderMetrics('item', this.workItemsViewedCount(), this.workItemsNotViewedCount());
  },
  risksMetrics() {
    return this._renderMetrics('risk', this.risksViewedCount(), this.risksNotViewedCount());
  },
  titles() {
    return getC('homeScreenTitles', this.organization());
  },
});
