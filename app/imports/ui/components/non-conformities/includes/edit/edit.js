import { Template } from 'meteor/templating';

import { update } from '/imports/api/non-conformities/methods.js';

Template.EditNC.viewmodel({
  mixin: ['organization', 'modal', 'nonconformity'],
  NC() {
    return this._getNCByQuery({ _id: this._id() });
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  update({ query = {}, options = {}, ...args }, cb = () => {}) {
    const _id = this._id();
    const organizationId = this.organizationId();
    const allArgs = { ...args, _id, options, query, organizationId };

    this.modal().callMethod(update, allArgs, cb);
  }
});
