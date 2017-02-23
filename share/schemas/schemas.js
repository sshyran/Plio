import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import moment from 'moment-timezone';

import {
  ReminderTimeUnits, DocumentTypes, AnalysisStatuses,
  ReviewStatuses, SystemName, StringLimits,
  StandardStatuses, TimeUnits,
} from '../constants.js';


export const IdSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
});

const getTimePeriodSchema = ({ timeUnit = {}, timeValue = {} } = {}) => {
  const defaultTimeUnitDef = {
    type: String,
    allowedValues: _.values(TimeUnits),
  };

  const defaultTimeValueDef = {
    type: Number,
    min: 1,
    max: 999,
  };

  return new SimpleSchema({
    timeUnit: Object.assign({}, defaultTimeUnitDef, timeUnit),
    timeValue: Object.assign({}, defaultTimeValueDef, timeValue),
  });
};

export const TimePeriodSchema = getTimePeriodSchema();

export const ReminderTimePeriodSchema = getTimePeriodSchema({
  timeUnit: {
    allowedValues: _.values(ReminderTimeUnits),
  },
});

export const NewUserDataSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 1,
    max: 20,
  },
  lastName: {
    type: String,
    min: 1,
    max: 20,
  },
  password: {
    type: String,
    min: 6,
    max: 20,
  },
});

export const UrlSchema = new SimpleSchema({
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
});

export const ErrorSchema = new SimpleSchema({
  'error.error': {
    type: String,
    min: 3,
    max: 50,
  },
  'error.details': {
    type: String,
    optional: true,
    min: 3,
    max: 150,
  },
});

export const ProgressSchema = new SimpleSchema({
  progress: {
    type: Number,
    min: 0,
    max: 1,
    decimal: true,
    defaultValue: 0,
  },
});

export const idSchemaDoc = {
  type: String,
  regEx: SimpleSchema.RegEx.Id,
};

export const OrganizationIdSchema = new SimpleSchema({
  organizationId: idSchemaDoc,
});

export const StandardIdSchema = new SimpleSchema({
  standardId: idSchemaDoc,
});

export const UserIdSchema = new SimpleSchema({
  userId: idSchemaDoc,
});

export const DiscussionIdSchema = new SimpleSchema({
  discussionId: idSchemaDoc,
});

export const DocumentIdSchema = new SimpleSchema({
  documentId: idSchemaDoc,
});

export const DocumentTypeSchema = new SimpleSchema({
  documentType: {
    type: String,
    allowedValues: _.values(DocumentTypes),
  },
});

export const optionsSchema = new SimpleSchema({
  options: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  query: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

export const CreatedAtSchema = new SimpleSchema({
  createdAt: {
    type: Date,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }

      return this.unset();
    },
  },
});

const dbChangeExecutor = new RegExp(
  `^([23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17})|${SystemName}$`
);

export const CreatedBySchema = new SimpleSchema({
  createdBy: {
    type: String,
    regEx: dbChangeExecutor,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return this.userId || (this.isSet && this.value) || SystemName;
      }

      return this.unset();
    },
  },
});

// BUG: updating document calls autoValue twice on client
// because of the actual method call and the subscription afterwards
export const UpdatedAtSchema = new SimpleSchema({
  updatedAt: {
    type: Date,
    optional: true,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      } else {
        this.unset();
      }
    }
  }
});

export const UpdatedBySchema = new SimpleSchema({
  updatedBy: {
    type: String,
    regEx: dbChangeExecutor,
    optional: true,
    autoValue() {
      if (this.isUpdate) {
        return this.userId || (this.isSet && this.value) || SystemName;
      }

      return this.unset();
    },
  },
});

export const BaseEntitySchema = new SimpleSchema([
  CreatedAtSchema,
  CreatedBySchema,
  UpdatedAtSchema,
  UpdatedBySchema,
]);

export const FileIdsSchema = new SimpleSchema({
  fileIds: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    defaultValue: [],
    optional: true,
  },
});

export const ImprovementPlanSchema = new SimpleSchema([
  {
    desiredOutcome: {
      type: String,
      optional: true,
    },
    targetDate: {
      type: Date,
      optional: true,
    },
    reviewDates: {
      type: [Object],
      optional: true,
      defaultValue: [],
    },
    'reviewDates.$.date': {
      type: Date,
    },
    'reviewDates.$._id': {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    owner: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  },
  FileIdsSchema,
]);

export const getNotifySchema = (field) => {
  return new SimpleSchema({
    notify: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      autoValue() {
        if (this.isInsert) {
          const userIdField = this.field(field);
          if (userIdField.isSet) {
            return [userIdField.value];
          } else {
            this.unset();
          }
        }
      },
    },
  });
};

export const ViewedBySchema = new SimpleSchema({
  viewedBy: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return [this.userId];
      }
    },
  },
});

export const DeletedSchema = new SimpleSchema({
  isDeleted: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  deletedBy: {
    type: String,
    regEx: dbChangeExecutor,
    optional: true,
  },
  deletedAt: {
    type: Date,
    optional: true,
  },
});

export const FileSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  extension: {
    type: String,
    autoValue() {
      if (this.isSet) {
        return this.value.toLowerCase();
      }
    },
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  name: {
    type: String,
  },
});

export const BaseProblemsRequiredSchema = new SimpleSchema([
  OrganizationIdSchema,
  FileIdsSchema,
  {
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    identifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    identifiedAt: {
      type: Date,
    },
    magnitude: {
      type: String,
    },
    standardsIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      minCount: 1,
    },
  },
]);

export const BaseProblemsOptionalSchema = ((() => {
  const getRepeatingFields = (key) => {
    return {
      [`${key}.targetDate`]: {
        type: Date,
        optional: true,
      },
      [`${key}.executor`]: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
      },
      [`${key}.status`]: {
        type: Number,
        allowedValues: _.keys(AnalysisStatuses).map(status => parseInt(status, 10)),
        defaultValue: 0,
        optional: true,
      },
      [`${key}.completionComments`]: {
        type: String,
        optional: true,
        max: 140,
      },
      [`${key}.completedAt`]: {
        type: Date,
        optional: true,
      },
      [`${key}.completedBy`]: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
      },
      [`${key}.assignedBy`]: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
      },
    };
  };

  const analysis = {
    analysis: {
      type: Object,
      optional: true,
    },
    ...getRepeatingFields('analysis'),
  };

  const updateOfStandards = {
    updateOfStandards: {
      type: Object,
      optional: true,
    },
    ...getRepeatingFields('updateOfStandards'),
  };

  return new SimpleSchema([
    DeletedSchema,
    ViewedBySchema,
    FileIdsSchema,
    getNotifySchema('identifiedBy'),
    {
      description: {
        type: String,
        optional: true,
      },
      statusComment: {
        type: String,
        optional: true,
      },
      departmentsIds: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id,
        defaultValue: [],
        optional: true,
      },
      improvementPlan: {
        type: ImprovementPlanSchema,
        optional: true,
      },
      ...analysis,
      ...updateOfStandards,
    },
  ]);
})());


export const TimezoneSchema = new SimpleSchema({
  timezone: {
    type: String,
    allowedValues: moment.tz.names(),
    optional: true,
  },
});

export const ReviewSchema = ((() => {
  const schema = new SimpleSchema({
    status: {
      type: Number,
      allowedValues: _.keys(ReviewStatuses).map(status => parseInt(status, 10)),
      defaultValue: 2,
    },
    reviewedAt: {
      type: Date,
      optional: true,
      custom() {
        const value = this.value;
        if (!_.isDate(value)) {
          return;
        }

        return moment(value).isBefore(new Date()) ? true : 'badDate';
      },
    },
    reviewedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    comments: {
      type: String,
      max: 140,
      optional: true,
    },
  });

  return new SimpleSchema({
    review: {
      type: schema,
      defaultValue: {},
      optional: true,
    },
  });
})());

export const CompleteActionSchema = new SimpleSchema([
  IdSchema,
  {
    completionComments: {
      type: String,
      optional: true,
      max: 140,
    },
  },
]);

export const ownerIdSchema = new SimpleSchema({
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
});

export const standardStatusSchema = new SimpleSchema({
  status: {
    type: String,
    allowedValues: _.keys(StandardStatuses),
  },
});

export const issueNumberSchema = new SimpleSchema({
  issueNumber: {
    type: Number,
    min: 1,
    max: 1000,
    defaultValue: 1,
    optional: true,
  },
});

export const pwdSchemaObj = {
  type: String,
  regEx: /^[A-Fa-f0-9]{64}$/,
};
