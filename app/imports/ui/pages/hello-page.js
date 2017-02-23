import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment-timezone';

import { Organizations } from '/imports/share/collections/organizations';
import { remove } from '/imports/api/users/methods';
import { OrgCurrencies } from '/imports/share/constants';
import { createOrgQueryWhereUserIsMember } from '/imports/api/queries';
import { getSelectedOrgSerialNumber } from '/imports/api/helpers';


Template.HelloPage.viewmodel({
  mixin: ['router', 'modal'],
  onCreated(template) {
    template.autorun(() => {
      const currentUser = Meteor.user();
      const organizationsHandle = template.subscribe('currentUserOrganizations');
      if (!Meteor.loggingIn() && organizationsHandle.ready()) {
        if (currentUser) {
          const query = createOrgQueryWhereUserIsMember(currentUser._id);
          const selectedOrganizationSerialNumber = getSelectedOrgSerialNumber();
          const serialNumber = parseInt(selectedOrganizationSerialNumber, 10);
          const orgExists = !!Organizations.findOne({ ...query, serialNumber });

          if (serialNumber && orgExists) {
            this.goToDashboard(serialNumber);
          } else {
            const org = Organizations.findOne(query);
            if (org) {
              localStorage.setItem(
                `${Meteor.userId()}: selectedOrganizationSerialNumber`,
                org.serialNumber
              );
              this.goToDashboard(org.serialNumber);
            }
          }
        } else {
          FlowRouter.withReplaceState(() => {
            FlowRouter.go('signIn');
          });
        }
      }
    });
  },
  openCreateNewOrgModal(e) {
    e.preventDefault();

    this.modal().open({
      template: 'Organizations_Create',
      _title: 'New organization',
      variation: 'save',
      timezone: moment.tz.guess(),
      ownerName: Meteor.user().fullName(),
      currency: OrgCurrencies.GBP
    });
  },
  deleteAccount(e) {
    e.preventDefault();

    swal({
      title: 'Are you sure?',
      text: `Your account will be deleted permanently!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      closeOnConfirm: false
    }, () => {
      remove.call({}, (err) => {
        if (err) {
          swal({
            title: 'Oops... Something went wrong!',
            text: err.reason,
            type:'error',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        } else {
          swal({
            title: 'Removed!',
            text: `Your account was removed successfully!`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        }
      });
    });
  }
});
