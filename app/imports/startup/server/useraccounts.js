import { Roles } from 'meteor/alanning:roles';

import OrganizationService from '/imports/api/organizations/organization-service';
import { OrgOwnerRoles } from '/imports/share/constants';
import { ORG_EnsureNameIsUnique } from '/imports/api/checkers';

function postSignUpHook(userId, info) {
  const orgName = info.profile.organizationName || 'My Organization';
  const orgTimezone = info.profile.organizationTimezone || 'Europe/London';

  let orgId;
  try {
    ORG_EnsureNameIsUnique({ name: orgName });

    orgId = OrganizationService.insert({
      name: orgName,
      timezone: orgTimezone,
      ownerId: userId
    });
  } catch(err) {
    Meteor.users.remove({ _id: userId });
    throw err;
  }

  Roles.addUsersToRoles(userId, OrgOwnerRoles, orgId);

  Meteor.users.update({
    _id: userId
  }, {
    $unset: {
      'profile.organizationName': '',
      'profile.organizationTimezone': ''
    }
  });
}

AccountsTemplates.configure({
  postSignUpHook
});
