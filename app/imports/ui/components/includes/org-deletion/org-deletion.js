import { Template } from 'meteor/templating';
import { SHA256 } from 'meteor/sha';

import { Organizations } from '/imports/share/collections/organizations';
import {
  ORG_DELETE as ORG_DELETE_SWAL_PARAMS,
} from '/imports/api/swal-params';
import swal from '/imports/ui/utils/swal';

Template.OrgDeletion.viewmodel({
  mixin: 'modal',
  organizationId: '',
  deleteOrganization: null,
  beforeDelete: null,
  afterDelete: null,
  organization() {
    return Organizations.findOne({
      _id: this.organizationId(),
    }, {
      fields: { name: 1 },
    });
  },
  onDeteteButtonClick(e) {
    if (this.beforeDelete) this.beforeDelete();
    this._showDeleteOrgWarning();
  },
  _showDeleteOrgWarning() {
    swal(ORG_DELETE_SWAL_PARAMS, () => {
      this._showDeleteOrgPasswordInput();
    });
  },
  _showDeleteOrgPasswordInput() {
    const { name } = this.organization() || {};
    const params = {
      title: `Confirm deletion of "${name}" organization`,
    };
    const cb = (password) => {
      if (!password) {
        swal.showInputError('Password can not be empty');
        return false;
      }

      return this._deleteOrganization(password);
    };

    swal.showPasswordForm(params, cb);
  },
  _deleteOrganization(pwd) {
    const { name: orgName } = this.organization() || {};
    const organizationId = this.organizationId();
    const password = SHA256(pwd); // eslint-disable-line new-cap

    this.deleteOrganization({
      organizationId,
      password,
    }, (err, res) => {
      if (err) {
        swal.error(err);
      } else {
        swal.success('Success', `Organization ${orgName} has been deleted`);
      }

      if (this.afterDelete) this.afterDelete(err, res, organizationId);
    });
  },
});
