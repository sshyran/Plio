import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import property from 'lodash.property';

import OrganizationService from './organization-service';
import InvitationService from './invitation-service';

import {
  OrganizationCurrencySchema,
  UserSettingsSchema,
  CustomerTypeSchema,
  reviewFrequencySchema,
  reviewAnnualDateSchema,
  reviewReviewerIdSchema,
} from '/imports/share/schemas/organization-schema';
import {
  WorkflowTypes, ProblemMagnitudes, InvitationStatuses,
  DocumentTypes, DocumentTypesPlural,
} from '/imports/share/constants';
import {
  IdSchema, ReminderTimePeriodSchema,
  OrganizationIdSchema, NewUserDataSchema,
  UserIdSchema, TimezoneSchema,
  pwdSchemaObj, idSchemaDoc,
} from '/imports/share/schemas/schemas';
import Method from '../method.js';
import { chain, compose } from '/imports/api/helpers.js';
import {
  checkOrgMembership,
  ORG_CheckExistance,
  ORG_EnsureCanChange,
  ORG_EnsureNameIsUnique,
  ORG_EnsureCanInvite,
  ORG_EnsureCanDeleteUsers,
  ORG_EnsureIsOwner,
  ORG_OnTransferCreateChecker,
  ORG_OnTransferChecker,
  ORG_EnsureCanDelete,
  ORG_EnsureCanBeDeleted,
  USR_EnsureIsPlioAdmin,
  USR_EnsureIsPlioUser,
} from '../checkers.js';
import { USR_EnsurePasswordIsValid, ensureCanChangeRoles } from '/imports/api/users/checkers';
import { ensureCanUnsubscribeFromDailyRecap, ensureThereIsNoDocuments } from './checkers';
import { CANNOT_IMPORT_DOCS } from './errors';


const nameSchema = new SimpleSchema({ name: { type: String } });

const problemGuidelineTypeSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: _.values(ProblemMagnitudes)
  }
});

const ensureCanChange = function ensureCanChange({ _id }) {
  return ORG_EnsureCanChange(this.userId, _id);
};

const ensureCanInvite = function ensureCanInvite({ organizationId }) {
  return ORG_EnsureCanInvite(this.userId, organizationId);
};

const ensureCanDelete = function ensureCanDelete({ userId, organizationId }) {
  return ORG_EnsureCanDeleteUsers(userId, this.userId, organizationId);
};

export const insert = new Method({
  name: 'Organizations.insert',

  validate(doc) {
    const schema = new SimpleSchema([
      nameSchema,
      TimezoneSchema,
      OrganizationCurrencySchema
    ]);

    schema.clean(doc, {
      removeEmptyStrings: true
    });

    return schema.validator()(doc);
  },

  check(checker) {
    return checker(ORG_EnsureNameIsUnique);
  },

  run({ name, timezone, currency }) {
    if (Meteor.isServer) {
      return OrganizationService.insert({
        name,
        timezone,
        currency,
        ownerId: this.userId
      });
    }
  }
});

export const setName = new Method({
  name: 'Organizations.setName',

  validate: new SimpleSchema([
    IdSchema,
    nameSchema
  ]).validator(),

  check(checker) {
    return checker(chain(ensureCanChange.bind(this), ORG_EnsureNameIsUnique));
  },

  run({ _id, ...args }) {
    return OrganizationService.setName({ _id, ...args });
  }
});

export const setTimezone = new Method({
  name: 'Organizations.setTimezone',

  validate: new SimpleSchema([
    IdSchema,
    TimezoneSchema
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setTimezone({ ...args });
  }
});

export const setDefaultCurrency = new Method({
  name: 'Organizations.setDefaultCurrency',

  validate: new SimpleSchema([IdSchema, {
    currency: { type: String }
  }]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setDefaultCurrency({ ...args });
  }
});

export const setWorkflowDefaults = new Method({
  name: 'Organizations.setWorkflowDefaults',

  validate: new SimpleSchema([
    IdSchema,
    {
      type: {
        type: String,
        allowedValues: ['minorProblem', 'majorProblem', 'criticalProblem']
      },
      workflowType: {
        type: String,
        allowedValues: _.values(WorkflowTypes),
        optional: true
      },
      stepTime: {
        type: ReminderTimePeriodSchema,
        optional: true
      }
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setWorkflowDefaults({ ...args });
  }
});

const reminderTypeSchema = new SimpleSchema({
  reminderType: {
    type: String,
    allowedValues: ['start', 'interval', 'until'],
  },
});

export const setReminder = new Method({
  name: 'Organizations.setReminder',

  validate: new SimpleSchema([
    IdSchema,
    ReminderTimePeriodSchema,
    reminderTypeSchema,
    {
      type: {
        type: String,
        allowedValues: ['minorNc', 'majorNc', 'criticalNc', 'improvementPlan'],
      },
    },
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setReminder({ ...args });
  }
});

export const setNCGuideline = new Method({
  name: 'Organizations.setNCGuideline',

  validate: new SimpleSchema([
    IdSchema,
    problemGuidelineTypeSchema,
    {
      text: { type: String }
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setNCGuideline({ ...args });
  }
});

export const setRKGuideline = new Method({
  name: 'Organizations.setRKGuideline',

  validate: new SimpleSchema([
    IdSchema, problemGuidelineTypeSchema,
    {
      text: {type: String}
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run(doc) {
    return OrganizationService.setRKGuideline(doc);
  }
});

export const setRKScoringGuidelines = new Method({
  name: 'Organizations.setRKScoringGuidelines',

  validate: new SimpleSchema([
    IdSchema, {
      rkScoringGuidelines: { type: String }
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ _id, rkScoringGuidelines }) {
    return OrganizationService.setRKScoringGuidelines({ _id, rkScoringGuidelines });
  },
});

const reviewDocumentKeySchema = new SimpleSchema({
  documentKey: {
    type: String,
    allowedValues: [DocumentTypesPlural.STANDARDS, DocumentTypesPlural.RISKS],
  },
});

export const setReviewReviewerId = new Method({
  name: 'Organizations.setReviewReviewerId',

  validate: new SimpleSchema([
    IdSchema,
    reviewDocumentKeySchema,
    reviewReviewerIdSchema,
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run(args) {
    return OrganizationService.setReviewReviewerId(args);
  },
});

export const setReviewFrequency = new Method({
  name: 'Organizations.setReviewFrequency',

  validate: new SimpleSchema([
    IdSchema,
    reviewDocumentKeySchema,
    reviewFrequencySchema,
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run(args) {
    return OrganizationService.setReviewFrequency(args);
  },
});

export const setReviewAnnualDate = new Method({
  name: 'Organizations.setReviewAnnualDate',

  validate: new SimpleSchema([
    IdSchema,
    reviewDocumentKeySchema,
    reviewAnnualDateSchema,
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run(args) {
    return OrganizationService.setReviewAnnualDate(args);
  },
});

export const setReviewReminderTimeValue = new Method({
  name: 'Organizations.setReviewReminderTimeValue',

  validate: new SimpleSchema([
    IdSchema,
    reviewDocumentKeySchema,
    reminderTypeSchema,
    {
      timeValue: ReminderTimePeriodSchema.schema('timeValue'),
    },
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run(args) {
    return OrganizationService.setReviewReminderTimeValue(args);
  },
});

export const setReviewReminderTimeUnit = new Method({
  name: 'Organizations.setReviewReminderTimeUnit',

  validate: new SimpleSchema([
    IdSchema,
    reviewDocumentKeySchema,
    reminderTypeSchema,
    {
      timeUnit: ReminderTimePeriodSchema.schema('timeUnit'),
    },
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run(args) {
    return OrganizationService.setReviewReminderTimeUnit(args);
  },
});

export const inviteUserByEmail = new Method({
  name: 'Organizations.inviteUserByEmail',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      },
      welcomeMessage: {
        type: String
      }
    }
  ]).validator(),

  check(checker) {
    checker(ensureCanInvite.bind(this));
  },

  run({ organizationId, email, welcomeMessage }) {
    if (this.isSimulation) {
      return;
    }

    InvitationService.inviteUserByEmail(organizationId, email, welcomeMessage);

    return InvitationService.getInvitationExpirationTime();
  }
});

export const acceptInvitation = new ValidatedMethod({
  name: 'Organizations.acceptInvitation',

  validate: new SimpleSchema({
    invitationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    userData: {
      type: NewUserDataSchema
    }
  }).validator(),

  run({ invitationId, userData }) {
    if (this.isSimulation) {
      return;
    }

    //no permission checks are required
    InvitationService.acceptInvitation(invitationId, userData);
  }
});


export const inviteMultipleUsersByEmail = new Method({
  name: 'Organizations.inviteMultipleUsers',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      emails: {
        label: "Email address",
        type: [String],
        regEx: SimpleSchema.RegEx.Email
      },
      welcomeMessage: {
        type: String
      }
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanInvite.bind(this));
  },

  run({ organizationId, emails, welcomeMessage }) {
    if (this.isSimulation) {
      return;
    }

    let invitedEmails = [];
    let addedEmails = [];
    let errors = [];
    emails.forEach(email => {
      //aggregate service errors for each email
      try {
        const invitationStatus = InvitationService.inviteUserByEmail(organizationId, email, welcomeMessage);
        if (invitationStatus === InvitationStatuses.invited) {
          invitedEmails.push(email);
        } else if (invitationStatus === InvitationStatuses.added) {
          addedEmails.push(email);
        }
      } catch (err) {
        console.error(err);
        errors.push(err.reason);
      }
    });

    const generateErrorMessage = () => {
      if (errors.length > 0) {
        return `Failed to invite ${errors.length} user(s):\n${errors.join('.\n')}`;
      } else {
        return null;
      }
    };

    return {
      invitedEmails,
      addedEmails,
      error: generateErrorMessage(),
      expirationTime: InvitationService.getInvitationExpirationTime()
    };
  }
});

export const removeUser = new Method({
  name: 'Organizations.removeUser',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    UserIdSchema
  ]).validator(),

  check(checker) {
    return checker(ensureCanDelete.bind(this));
  },

  run({ userId, organizationId }) {
    return OrganizationService.removeUser({
      organizationId,
      userId,
      removedBy: this.userId
    });
  }
});

export const createOrganizationTransfer = new Method({
  name: 'Organizations.createTransfer',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      newOwnerId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      }
    }
  ]).validator(),

  check(checker) {
    const mapArgs = fn => ({ organizationId, newOwnerId }) => fn(newOwnerId, this.userId, organizationId);

    return checker(mapArgs(ORG_OnTransferCreateChecker));
  },

  run({ organizationId, newOwnerId }) {
    if (this.isSimulation) {
      return;
    }

    return OrganizationService.createTransfer({
      organizationId,
      newOwnerId,
      currOwnerId: this.userId
    });
  }
});

export const transferOrganization = new Method({
  name: 'Organizations.transfer',

  validate: new SimpleSchema({
    transferId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  check(checker) {
    const mapArgs = fn => ({ transferId }) => fn(this.userId, transferId);

    return checker(mapArgs(ORG_OnTransferChecker));
  },

  run({ transferId }, organization) {
    return OrganizationService.transfer({
      transferId,
      newOwnerId: this.userId
    }, organization);
  }
});

export const cancelOrganizationTransfer = new Method({
  name: 'Organizations.cancelTransfer',

  validate: OrganizationIdSchema.validator(),

  check(checker) {
    const mapArgs = fn => ({ organizationId }) => fn(this.userId, organizationId);

    return checker(mapArgs(ORG_EnsureIsOwner));
  },

  run({ organizationId }) {
    return OrganizationService.cancelTransfer({ organizationId });
  }
});

export const updateUserSettings = new Method({
  name: 'Organizations.updateUserSettings',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    UserSettingsSchema
  ]).validator(),

  run({ organizationId, ...args }) {
    return OrganizationService.updateUserSettings({
      userId: this.userId,
      organizationId,
      ...args
    });
  }
});

export const deleteOrganization = new Method({
  name: 'Organizations.deleteOrganization',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    // org owner's password encoded with SHA256
    {
      ownerPassword: {
        type: String,
        regEx: /^[A-Fa-f0-9]{64}$/
      }
    }
  ]).validator(),

  check(checker) {
    if (this.isSimulation) {
      return;
    }

    return checker(chain(
      ({ organizationId }) => ORG_EnsureCanDelete(this.userId, organizationId),
      ({ ownerPassword }) => USR_EnsurePasswordIsValid(this.userId, ownerPassword),
      ({ organizationId }) => ORG_EnsureCanBeDeleted(organizationId)
    ));
  },

  run({ organizationId }) {
    if (this.isSimulation) {
      return;
    }

    return OrganizationService.deleteOrganization({ organizationId });
  }
});

export const deleteCustomerOrganization = new Method({
  name: 'Organizations.deleteCustomerOrganization',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      // Plio Ltd. owner's password encoded with SHA256
      adminPassword: pwdSchemaObj,
    }
  ]).validator(),

  check(checker) {
    if (this.isSimulation) {
      return;
    }

    return checker(chain(
      () => USR_EnsureIsPlioAdmin(this.userId),
      ({ adminPassword }) => USR_EnsurePasswordIsValid(this.userId, adminPassword),
      ({ organizationId }) => ORG_EnsureCanBeDeleted(organizationId)
    ));
  },

  run({ organizationId }) {
    if (this.isSimulation) {
      return;
    }

    return OrganizationService.deleteOrganization({ organizationId });
  }
});

export const changeCustomerType = new Method({
  name: 'Organizations.changeCustomerType',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    CustomerTypeSchema,
  ]).validator(),

  check(checker) {
    return checker(() => USR_EnsureIsPlioUser(this.userId));
  },

  run(args) {
    return OrganizationService.changeCustomerType(args);
  },
});

export const changeTitle = new Method({
  name: 'Organizations.changeTitle',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      fieldName: {
        type: String,
      },
      fieldValue: {
        type: String,
      },
    },
  ]).validator(),

  check(checker) {
    if (this.isSimulation) {
      return undefined;
    }

    return checker(({ organizationId }) => ORG_EnsureCanChange(this.userId, organizationId));
  },

  run(args) {
    if (this.isSimulation) {
      return undefined;
    }

    return OrganizationService.setTitleValue(args);
  },
});

export const unsubscribeFromDailyRecap = new Method({
  name: 'Organizations.unsubscribeFromDailyRecap',

  validate: new SimpleSchema({
    orgSerialNumber: {
      type: Number,
    },
  }).validator(),

  check(checker) {
    if (this.isSimulation) return undefined;

    return checker(({ orgSerialNumber }) =>
      ensureCanUnsubscribeFromDailyRecap({ orgSerialNumber, userId: this.userId }));
  },

  run({ orgSerialNumber }) {
    if (this.isSimulation) return undefined;

    return OrganizationService.unsubscribeFromDailyRecap({ orgSerialNumber, userId: this.userId });
  },
});

export const updateLastAccessedDate = new Method({
  name: 'Organizations.updateLastAccessedDate',

  validate: new SimpleSchema([
    OrganizationIdSchema
  ]).validator(),

  check(checker) {
    if (this.isSimulation) {
      return undefined;
    }

    return checker(({ organizationId }) => checkOrgMembership(this.userId, organizationId));
  },

  run({ organizationId }) {
    if (this.isSimulation) {
      return undefined;
    }

    return OrganizationService.updateLastAccessedDate({ organizationId });
  },
});

export const importDocuments = new Method({
  name: 'Organizations.importDocuments',

  validate: new SimpleSchema({
    to: idSchemaDoc,
    from: idSchemaDoc,
    documentType: {
      type: String,
      allowedValues: [DocumentTypes.STANDARD/* , DocumentTypes.RISK */],
    },
    password: pwdSchemaObj,
  }).validator(),

  check(checker) {
    if (this.isSimulation) return undefined;
    const checkIfCanChangeRoles = ensureCanChangeRoles(this.userId);
    const throwIfThereAreDocs = ensureThereIsNoDocuments(CANNOT_IMPORT_DOCS);

    return checker(chain(
      compose(checkIfCanChangeRoles, property('to')),
      compose(checkIfCanChangeRoles, property('from')),
      compose(USR_EnsurePasswordIsValid(this.userId), property('password')),
      ({ to, documentType }) => throwIfThereAreDocs(documentType, to),
    ));
  },

  run(props) {
    if (this.isSimulation) return undefined;

    return OrganizationService.importDocuments({ ...props, userId: this.userId });
  },
});
