import { Template } from 'meteor/templating';

import {
  update,
  remove,
  insertScore,
  removeScore,
} from '/imports/api/risks/methods.js';
import { AnalysisTitles, ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.Risks_Card_Edit.viewmodel({
  mixin: ['risk', 'organization', 'callWithFocusCheck', 'modal', 'utils', 'router'],
  RiskRCALabel: AnalysisTitles.riskAnalysis,

  risk() {
    return this._getRiskByQuery({ _id: this._id() });
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  slingshotDirective: 'riskFiles',
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      riskId: this._id()
    };
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update({ query = {}, options = {}, e = {}, withFocusCheck = false, ...args }, cb = () => {}) {
    const _id = this._id();
    const allArgs = { ...args, _id, options, query };

    const updateFn = () => this.modal().callMethod(update, allArgs, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  remove() {
    const { title } = this.risk();
    const _id = this._id();

    swal({
      title: 'Are you sure?',
      text: `The risk "${title}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false
    }, () => {
      this.modal().callMethod(remove, { _id }, (err) => {
        if (err) {
          swal.close();
          return;
        };

        swal({
          title: 'Removed!',
          text: `The risk "${title}" was removed successfully.`,
          type: 'success',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });

        this.modal().close();

        this.handleRouteRisks();
      });
    });
  },
  onInsertScoreCb() {
    return this.insertScore.bind(this);
  },
  insertScore({ ...args }, cb) {
    const _id = this._id();

    this.modal().callMethod(insertScore, { _id, ...args }, cb);
  },
  onRemoveScoreCb() {
    return this.removeScore.bind(this);
  },
  removeScore({ ...args }, cb) {
    const _id = this._id();

    this.modal().callMethod(removeScore, { _id, ...args }, cb);
  }
});
