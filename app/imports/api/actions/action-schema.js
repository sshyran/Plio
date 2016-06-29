import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  FileSchema,
  NotifySchema
} from '../schemas.js';
import { ActionTypes, ActionPlanOptions, ProblemTypes } from '../constants.js';


const checkDate = function() {
  const value = this.value;
  if (!(value instanceof Date)) {
    return;
  }

  const utcValue = new Date(
    value.getTime() + (value.getTimezoneOffset() * 60000)
  );

  const now = new Date();
  const utcNow = new Date(
    now.getTime() + (now.getTimezoneOffset() * 60000)
  );

  return (utcValue >= utcNow) ? 'badDate' : true;
};

const linkedToSchema = new SimpleSchema({
  documentId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  documentType: {
    type: String,
    allowedValues: ProblemTypes
  }
});

const RequiredSchema = new SimpleSchema([
  OrganizationIdSchema,
  {
    title: {
      type: String,
      min: 1,
      max: 40
    },
    type: {
      type: String,
      allowedValues: _.values(ActionTypes)
    },
    linkedTo: {
      type: [linkedToSchema]
    },
    ownerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    planInPlace: {
      type: String,
      allowedValues: _.values(ActionPlanOptions)
    },
    completionTargetDate: {
      type: Date
    },
    toBeCompletedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }
]);

const ActionSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  NotifySchema,
  {
    serialNumber: {
      type: Number,
      min: 1
    },
    sequentialId: {
      type: String,
      regEx: /^(?:CA|PA|RC)[1-9][0-9]*$/
    },
    status: {
      type: Number,
      min: 0,
      max: 9,
      defaultValue: 0
    },
    isCompleted: {
      type: Boolean,
      defaultValue: false
    },
    completedAt: {
      type: Date,
      optional: true,
      custom: checkDate
    },
    completedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    completionResult: {
      type: String,
      max: 40,
      optional: true
    },
    isVerified: {
      type: Boolean,
      defaultValue: false
    },
    verificationTargetDate: {
      type: Date,
      optional: true
    },
    toBeVerifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    verifiedAt: {
      type: Date,
      optional: true,
      custom: checkDate
    },
    verifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    verificationResult: {
      type: String,
      max: 40,
      optional: true
    },
    isDeleted: {
      type: Boolean,
      defaultValue: false
    },
    deletedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    deletedAt: {
      type: Date,
      optional: true
    },
    notes: {
      type: String,
      optional: true
    },
    files: {
      type: [FileSchema],
      optional: true
    },
    viewedBy: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      autoValue() {
        if (this.isInsert) {
          return [this.userId];
        }
      }
    }
  }
]);


export { RequiredSchema, ActionSchema };
