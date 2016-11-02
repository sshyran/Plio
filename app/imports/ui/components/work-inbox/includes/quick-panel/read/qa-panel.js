import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { WorkItemsStore, ProblemTypes } from '/imports/share/constants.js';
import { AnalysisTitles } from '/imports/api/constants.js';
import { restore, remove } from '/imports/api/work-items/methods.js';
import { WorkInboxHelp } from '/imports/api/help-messages.js';

const { TYPES } = WorkItemsStore;

Template.WorkInbox_QAPanel_Read.viewmodel({
  mixin: ['user', 'date', 'utils', 'modal', 'workItemStatus', 'workInbox', 'router', 'organization'],
  doc: '',
  isCurrentUserAssignee({ assigneeId }) {
    return Meteor.userId() === assigneeId;
  },
  getButtonText({ type }) {
    if (type === TYPES.VERIFY_ACTION) {
      return 'Verify';
    } else {
      return 'Complete';
    }
  },
  getDescription({ type, linkedDoc, assigneeId, targetDate, isCompleted, completedAt }) {
    const chooseOne = this.chooseOne(isCompleted);
    const typeText = this.getLinkedDocTypeText({ type, linkedDoc });
    const operation = this.getOperationText({ type });
    const assignee = this.userNameOrEmail(assigneeId);

    let desc = `${typeText} ${chooseOne('', 'to be')} ${operation} by ${assignee}`;

    const date = chooseOne(completedAt, targetDate);
    if (date) {
      desc = `${desc} ${chooseOne('on', 'by')} ${this.renderDate(date)}`;
    }

    return desc;
  },
  getOperationText({ type }) {
    switch(type) {
      case TYPES.VERIFY_ACTION:
        return 'verified';
        break;
      default:
        return `${this.lowercase(this.getButtonText({ type }))}d`;
    }
  },
  openQAModal({ type, linkedDoc, ...args }) {
    const _title = this.capitalize(type);
    const helpText = ((type) => {
      switch (type) {
        case TYPES.COMPLETE_ACTION:
          return WorkInboxHelp.completeActionHelp;
        case TYPES.VERIFY_ACTION:
          return WorkInboxHelp.verifyActionHelp;
        case TYPES.COMPLETE_ANALYSIS:
          return WorkInboxHelp.completeAnalysisHelp;
        case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
          return WorkInboxHelp.updateDocumentHelp;
        default:
          return;
      }
    })(type);
    
    this.modal().open({
      _title,
      operation: this.getOperationText({ type }),
      typeText: this.getLinkedDocTypeText({ type, linkedDoc }),
      doc: { type, linkedDoc, ...args },
      helpText: helpText,
      closeCaption: 'Cancel',
      template: 'WorkInbox_QAPanel_Edit'
    });
  },
  restore({ _id, type, isCompleted, assigneeId }) {
    swal(
      {
        title: 'Are you sure?',
        text: `The work item "${this.capitalize(type || '')}" will be restored!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Restore',
        closeOnConfirm: false,
      },
      () => {
        const callback = (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Restored', `The work item "${this.capitalize(type)}" was restored successfully.`, 'success');

            const queryParams = this._getQueryParams({ isCompleted, assigneeId })(Meteor.userId());
            FlowRouter.setQueryParams(queryParams);
          }
          Meteor.setTimeout(() => this.goToWorkItem(_id), 0);
        };

        restore.call({ _id }, callback);
      }
    );
  },
  delete({ _id, isDeleted, type }) {
    swal(
      {
        title: 'Are you sure?',
        text: `The work item "${this.capitalize(type)}" will be deleted${isDeleted ? ' permanently' : ''}!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        closeOnConfirm: false,
      },
      () => {
        const callback = (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Deleted', `The work item "${this.capitalize(type)}" was deleted successfully.`, 'success');
          }
        };

        remove.call({ _id }, callback);
      }
    );
  }
});
