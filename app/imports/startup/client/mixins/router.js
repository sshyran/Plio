import { FlowRouter } from 'meteor/kadira:flow-router';
import invoke from 'lodash.invoke';

export default {
  goToDashboard(orgSerialNumber) {
    const params = { orgSerialNumber };
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('dashboardPage', params);
    });
  },
  goToStandard(urlItemId, withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber(), urlItemId };
    const queryParams = !!withQueryParams ? { filter: this.activeStandardFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('standard', params, queryParams);
    });
  },
  goToNC(urlItemId, withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber(), urlItemId };
    const queryParams = !!withQueryParams ? { filter: this.activeNCFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('nonconformity', params, queryParams);
    });
  },
  goToNCs(withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber() };
    const queryParams = !!withQueryParams ? { filter: this.activeNCFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('nonconformities', params, queryParams);
    });
  },
  goToWorkItem(workItemId, queryParams = { filter: this.activeWorkInboxFilterId() }) {
    const params = { workItemId, orgSerialNumber: this.organizationSerialNumber() };
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('workInboxItem', params, queryParams);
    });
  },
  goToWorkInbox(withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber() };
    const queryParams = !!withQueryParams ? { filter: this.activeWorkInboxFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('workInbox', params, queryParams);
    });
  },
  goToDefaultWorkItem(
    list = 'WorkInbox_List',
    getRouteOptions = '_findWorkItemForFilter',
    redirectHandler = 'goToWorkItem'
  ) {
    return redirectToDefaultDocument.call(this, list, getRouteOptions, redirectHandler);
  },
  goToRisk(urlItemId, withQueryParams = true) {
    const params = { urlItemId, orgSerialNumber: this.organizationSerialNumber() };
    const queryParams = !!withQueryParams ? { filter: this.activeRiskFilterId() } : {};
    console.log('risk', params, queryParams);
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('risk', params, queryParams);
    });
  },
  goToRisks(withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber() };
    const queryParams = !!withQueryParams ? { filter: this.activeRiskFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('risks', params, queryParams);
    });
  },
  goToUser(userId) {
    const params = {
      orgSerialNumber: this.organizationSerialNumber(),
      userId,
    };
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('userDirectoryUserPage', params);
    });
  },
  handleRouteRedirect(vmName) {
    return Meteor.defer(() => invoke(ViewModel.findOne(vmName), 'handleRoute'));
  },
  handleRouteRisks() {
    return this.handleRouteRedirect('Risks_List');
  },
  handleRouteWorkInbox() {
    return this.handleRouteRedirect('WorkInbox_List');
  },
  handleRouteNCs() {
    return this.handleRouteRedirect('NC_List');
  },
  handleRouteStandards() {
    return this.handleRouteRedirect('StandardsList');
  }
};
