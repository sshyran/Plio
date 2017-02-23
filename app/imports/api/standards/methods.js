import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import property from 'lodash.property';

import StandardsService from './standards-service.js';
import { StandardsSchema, StandardsUpdateSchema } from '/imports/share/schemas/standards-schema.js';
import { Standards } from '/imports/share/collections/standards.js';
import StandardsNotificationsSender from './standards-notifications-sender.js';
import {
  IdSchema,
  optionsSchema,
  StandardIdSchema,
  UserIdSchema,
  OrganizationIdSchema,
} from '/imports/share/schemas/schemas.js';
import {
  checkOrgMembership,
  onRemoveChecker,
  onRestoreChecker,
  S_EnsureCanChange,
  S_EnsureCanChangeChecker,
} from '../checkers.js';
import { chain, chainCheckers, inject, compose } from '/imports/api/helpers.js';
import Method, { CheckedMethod } from '../method.js';

const injectSTD = inject(Standards);

export const insert = new Method({
  name: 'Standards.insert',

  validate: StandardsSchema.validator(),

  run({ organizationId, ...args }) {
    chain(checkOrgMembership, S_EnsureCanChange)(this.userId, organizationId);

    return StandardsService.insert({ organizationId, ...args });
  },
});

export const update = new CheckedMethod({
  name: 'Standards.update',

  validate: new SimpleSchema([
    IdSchema, StandardsUpdateSchema, optionsSchema,
  ]).validator(),

  check: checker => injectSTD(checker)(S_EnsureCanChangeChecker),

  run({ ...args }) {
    return StandardsService.update({ ...args });
  },
});

export const updateViewedBy = new CheckedMethod({
  name: 'Standards.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => injectSTD(checker)(S_EnsureCanChangeChecker),

  run({ _id }) {
    return StandardsService.updateViewedBy({ _id, userId: this.userId });
  },
});

export const remove = new CheckedMethod({
  name: 'Standards.remove',

  validate: IdSchema.validator(),

  check: checker => injectSTD(checker)(chainCheckers(S_EnsureCanChangeChecker, onRemoveChecker)),

  run({ _id }) {
    return StandardsService.remove({ _id, deletedBy: this.userId });
  },
});

export const restore = new CheckedMethod({
  name: 'Standards.restore',

  validate: IdSchema.validator(),

  check: checker => injectSTD(checker)(chainCheckers(S_EnsureCanChangeChecker, onRestoreChecker)),

  run({ _id }) {
    return StandardsService.restore({ _id });
  },
});

export const addedToNotifyList = new Method({
  name: 'Standards.addedToNotifyList',

  validate: new SimpleSchema([
    StandardIdSchema,
    UserIdSchema,
  ]).validator(),

  check: checker => injectSTD(checker)(S_EnsureCanChangeChecker),

  run({ standardId, userId }) {
    if (this.isSimulation) {
      return undefined;
    }

    if (userId !== this.userId) {
      return new StandardsNotificationsSender(standardId).addedToNotifyList(userId);
    }

    return undefined;
  },
});

export const removedFromNotifyList = new Method({
  name: 'Standards.removedFromNotifyList',

  validate: new SimpleSchema([
    StandardIdSchema,
  ]).validator(),

  check: checker => injectSTD(checker)(S_EnsureCanChangeChecker),

  run({ standardId }) {
    if (this.isSimulation) return undefined;

    return new StandardsNotificationsSender(standardId).removedFromNotifyList(this.userId);
  },
});

export const getCount = new Method({
  name: 'standards.getCount',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      isDeleted: {
        type: Boolean,
        optional: true,
      },
      limit: {
        type: Number,
        optional: true,
      },
    },
  ]).validator(),

  check(checker) {
    if (this.isSimulation) return undefined;

    return checker(
      compose(checkOrgMembership(this.userId), property('organizationId'))
    );
  },

  run(props) {
    if (this.isSimulation) return undefined;

    return StandardsService.getCount(props);
  },
});
