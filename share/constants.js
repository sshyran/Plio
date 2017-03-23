/* eslint max-len: ["error", 300] */

export const ActionPlanOptions = {
  YES: 'Yes',
  NO: 'No',
  NOT_NEEDED: 'Not needed',
};

export const ActionIndexes = {
  IN_PROGRESS: 1,
  DUE_COMPLETION_TODAY: 2,
  COMPLETION_OVERDUE: 3,
  NOT_YET_VERIFY: 4,
  VERIFY_DUE_TODAY: 5,
  VERIFY_OVERDUE: 6,
  COMPLETED_FAILED: 7,
  COMPLETED_EFFECTIVE: 8,
  COMPLETED: 9,
  DELETED: 10,
};

export const ActionStatuses = {
  [ActionIndexes.IN_PROGRESS]: 'In progress',
  [ActionIndexes.DUE_COMPLETION_TODAY]: 'In progress - due for completion today',
  [ActionIndexes.COMPLETION_OVERDUE]: 'In progress - completion overdue',
  [ActionIndexes.NOT_YET_VERIFY]: 'In progress - completed, not yet verified',
  [ActionIndexes.VERIFY_DUE_TODAY]: 'In progress - completed, verification due today',
  [ActionIndexes.VERIFY_OVERDUE]: 'In progress - completed, verification overdue',
  [ActionIndexes.COMPLETED_FAILED]: 'Completed - failed verification',
  [ActionIndexes.COMPLETED_EFFECTIVE]: 'Completed - verified as effective',
  [ActionIndexes.COMPLETED]: 'Completed',
  [ActionIndexes.DELETED]: 'Deleted',
};

export const ActionTypes = {
  CORRECTIVE_ACTION: 'CA',
  PREVENTATIVE_ACTION: 'PA',
  RISK_CONTROL: 'RC',
};

export const ActionUndoTimeInHours = 1;

export const AnalysisStatuses = {
  0: 'Not completed',
  1: 'Completed',
};

export const AvatarPlaceholders = [
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/1.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/2.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/3.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/4.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/5.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/6.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/7.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/8.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/9.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/10.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/11.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/12.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/13.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/14.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/15.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/16.png',
];

export const DefaultDateFormat = 'MMMM DD, YYYY';

export const PlioS3Logos = {
  square: 'https://s3-eu-west-1.amazonaws.com/plio/images/p-logo-square.png',
};

export const CollectionNames = {
  ACTIONS: 'Actions',
  AUDIT_LOGS: 'AuditLogs',
  CHANGELOG: 'Changelog',
  DEPARTMENTS: 'Departments',
  DISCUSSIONS: 'Discussions',
  FILES: 'Files',
  HELP_DOCS: 'HelpDocs',
  HELP_SECTIONS: 'HelpSections',
  LESSONS: 'LessonsLearned',
  MESSAGES: 'Messages',
  NCS: 'NonConformities',
  NOTIFICATIONS: 'Notifications',
  OCCURRENCES: 'Occurrences',
  ORGANIZATIONS: 'Organizations',
  REVIEWS: 'Reviews',
  RISK_TYPES: 'RiskTypes',
  RISKS: 'Risks',
  STANDARD_TYPES: 'StandardTypes',
  STANDARD_BOOK_SECTIONS: 'StandardsBookSections',
  STANDARDS: 'Standards',
  WORK_ITEMS: 'WorkItems',
  USERS: 'users',
};

export const DefaultRiskTypes = [
  {
    title: 'Credit risk',
  },
  {
    title: 'Liquidity risk',
  },
  {
    title: 'Market risk',
  },
  {
    title: 'Operational risk',
  },
  {
    title: 'Regulatory risk',
  },
  {
    title: 'Reputational risk',
  },
  {
    title: 'Infosecurity risk',
  },
];

export const DefaultStandardSections = [
  {
    title: 'Introduction',
  },
  {
    title: 'High level standards',
  },
  {
    title: 'Business standards',
  },
];

export const DefaultStandardTypes = [
  {
    title: 'Process',
    abbreviation: 'PRO',
  },
  {
    title: 'Policy',
    abbreviation: 'POL',
  },
  {
    title: 'Checklist',
    abbreviation: 'CHK',
  },
  {
    title: 'Compliance management objective',
    abbreviation: 'CMO',
  },
  {
    title: 'Compliance obligation',
    abbreviation: 'COB',
  },
  {
    title: 'Standard operating procedure',
    abbreviation: 'SOP',
  },
  {
    title: 'Work instruction',
    abbreviation: 'WORK',
  },
  {
    title: 'Product specification',
    abbreviation: 'SPEC',
  },
  {
    title: 'Risk control',
    abbreviation: 'RSC',
  },
  {
    title: 'Section header',
  },
];

export const DocChangesKinds = {
  DOC_CREATED: 1,
  DOC_UPDATED: 2,
  DOC_REMOVED: 3,
};

export const DefaultHelpSections = [
  {
    index: 1,
    title: 'How to get help',
  },
  {
    index: 2,
    title: 'Getting started',
  },
  {
    index: 3,
    title: 'Creating your Standards manual',
  },
  {
    index: 4,
    title: 'Managing risks',
  },
  {
    index: 5,
    title: 'Managing non-conformities',
  },
  {
    index: 6,
    title: 'Managing workflows',
  },
  {
    index: 7,
    title: 'User management',
  },
  {
    index: 8,
    title: 'FAQs',
  },
];

export const InvitationStatuses = {
  failed: 0,
  invited: 1,
  added: 2,
};

export const PhoneTypes = {
  WORK: 'Work',
  HOME: 'Home',
  MOBILE: 'Mobile',
};

export const ProblemMagnitudes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical',
};


export const ProblemIndexes = {
  REPORTED: 1,
  AWAITING_ANALYSIS: 2,
  ACTIONS_TO_BE_ADDED: 3,
  ANALYSIS_DUE_TODAY: 4,
  ANALYSIS_OVERDUE: 5,
  ANALYSIS_COMPLETED_ACTIONS_NEED: 6,
  ANALYSIS_COMPLETED_ACTIONS_IN_PLACE: 7,
  ACTIONS_IN_PLACE: 8,
  ACTIONS_DUE_TODAY: 9,
  ACTIONS_OVERDUE: 10,
  OPEN_ACTIONS_COMPLETED: 11,
  ACTIONS_COMPLETED_WAITING_VERIFY: 12,
  VERIFY_DUE_TODAY: 13,
  VERIFY_PAST_DUE: 14,
  ACTIONS_AWAITING_APPROVAL: 15,
  ACTIONS_UPDATE_DUE_TODAY: 16,
  ACTIONS_UPDATE_PAST_DUE: 17,
  ACTIONS_FAILED_VERIFICATION: 18,
  CLOSED_ACTIONS_COMPLETED: 19,
  ACTIONS_VERIFIED_STANDARDS_REVIEWED: 20,
  DELETED: 21,
};

export const ProblemsStatuses = {
  [ProblemIndexes.REPORTED]: 'Open - just reported',
  [ProblemIndexes.AWAITING_ANALYSIS]: 'Open - just reported, awaiting analysis',
  [ProblemIndexes.ACTIONS_TO_BE_ADDED]: 'Open - just reported, action(s) to be added',
  [ProblemIndexes.ANALYSIS_DUE_TODAY]: 'Open - analysis due today',
  [ProblemIndexes.ANALYSIS_OVERDUE]: 'Open - analysis overdue',
  [ProblemIndexes.ANALYSIS_COMPLETED_ACTIONS_NEED]: 'Open - analysis completed, action(s) need to be added',
  [ProblemIndexes.ANALYSIS_COMPLETED_ACTIONS_IN_PLACE]: 'Open - analysis completed, action(s) in place',
  [ProblemIndexes.ACTIONS_IN_PLACE]: 'Open - action(s) in place',
  [ProblemIndexes.ACTIONS_DUE_TODAY]: 'Open - action(s) due today',
  [ProblemIndexes.ACTIONS_OVERDUE]: 'Open - action(s) overdue',
  [ProblemIndexes.OPEN_ACTIONS_COMPLETED]: 'Open - action(s) completed',
  [ProblemIndexes.ACTIONS_COMPLETED_WAITING_VERIFY]: 'Open - action(s) completed, awaiting verification',
  [ProblemIndexes.VERIFY_DUE_TODAY]: 'Open - verification due today',
  [ProblemIndexes.VERIFY_PAST_DUE]: 'Open - verification past due',
  [ProblemIndexes.ACTIONS_AWAITING_APPROVAL]: 'Open - action(s) verified as effective, awaiting approval',
  [ProblemIndexes.ACTIONS_UPDATE_DUE_TODAY]: 'Open - action(s) verified as effective, approval due today',
  [ProblemIndexes.ACTIONS_UPDATE_PAST_DUE]: 'Open - action(s) verified as effective, approval past due',
  [ProblemIndexes.ACTIONS_FAILED_VERIFICATION]: 'Open - action(s) failed verification',
  [ProblemIndexes.CLOSED_ACTIONS_COMPLETED]: 'Closed - action(s) completed',
  [ProblemIndexes.ACTIONS_VERIFIED_STANDARDS_REVIEWED]: 'action(s) verified, approval given, and notification(s) sent to Owner(s) of standard(s) to remind them to update standards',
  [ProblemIndexes.DELETED]: 'Deleted',
};

export const ProblemTypes = {
  NON_CONFORMITY: 'non-conformity',
  RISK: 'risk',
};

export const DocumentTypes = {
  STANDARD: 'standard',
  ...ProblemTypes,
  ...ActionTypes,
};

export const DocumentTypesPlural = {
  STANDARDS: 'standards',
  NON_CONFORMITIES: 'non-conformities',
  RISKS: 'risks',
};

export const AllDocumentTypes = {
  ...DocumentTypes,
  DISCUSSION: 'discussion',
};

export const ReviewStatuses = {
  0: 'Overdue',
  1: 'Awaiting review',
  2: 'Up-to-date',
};

export const RCAMaxCauses = 5;

export const RiskEvaluationDecisions = {
  tolerate: 'Tolerate',
  treat: 'Treat',
  transfer: 'Transfer',
  terminate: 'Terminate',
};

export const RiskEvaluationPriorities = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const riskScoreTypes = {
  inherent: {
    id: 'inherent',
    label: 'Inherent risk',
    adj: 'Inherent',
  },
  residual: {
    id: 'residual',
    label: 'Residual risk',
    adj: 'Residual',
  },
};

export const SourceTypes = {
  ATTACHMENT: 'attachment',
  URL: 'url',
  VIDEO: 'video',
};

export const StandardStatuses = {
  issued: 'Issued',
  draft: 'Draft',
};

export const StringLimits = {
  abbreviation: {
    min: 1,
    max: 4,
  },
  title: {
    min: 1,
    max: 80,
  },
  url: {
    min: 1,
    max: 2000,
  },
  comments: {
    min: 1,
    max: 140,
  },
  sequentialId: {
    min: 3,
  },
};

export const SystemName = 'Plio';

export const ReminderTimeUnits = {
  DAYS: 'days',
  WEEKS: 'weeks',
};

export const TimeUnits = {
  ...ReminderTimeUnits,
  MONTHS: 'months',
};

export const UserMembership = {
  ORG_OWNER: 'owner',
  ORG_MEMBER: 'member',
};

export const UserRoles = {
  CREATE_UPDATE_DELETE_STANDARDS: 'create-update-delete-standards',
  VIEW_TEAM_ACTIONS: 'view-team-actions',
  INVITE_USERS: 'invite-users',
  DELETE_USERS: 'delete-users',
  EDIT_USER_ROLES: 'edit-user-roles',
  CHANGE_ORG_SETTINGS: 'change-org-settings',
};

export const UserRolesNames = {
  [UserRoles.CREATE_UPDATE_DELETE_STANDARDS]: 'Create & edit standards documents',
  [UserRoles.VIEW_TEAM_ACTIONS]: 'View all Team actions',
  [UserRoles.INVITE_USERS]: 'Invite users',
  [UserRoles.DELETE_USERS]: 'Delete users',
  [UserRoles.EDIT_USER_ROLES]: 'Edit user superpowers',
  [UserRoles.CHANGE_ORG_SETTINGS]: 'Change organization settings',
};

export const WorkItemsStore = {
  TYPES: {
    COMPLETE_ACTION: 'complete action',
    VERIFY_ACTION: 'verify action',
    COMPLETE_ANALYSIS: 'complete analysis',
    COMPLETE_UPDATE_OF_DOCUMENTS: 'complete update of documents',
  },
  LINKED_TYPES: {
    ...ActionTypes,
    ...ProblemTypes,
  },
  STATUSES: {
    0: 'in progress',
    1: 'due today',
    2: 'overdue',
    3: 'completed',
  },
};

export const WorkflowTypes = {
  THREE_STEP: '3-step',
  SIX_STEP: '6-step',
};

export const OrgOwnerRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS,
  UserRoles.INVITE_USERS,
  UserRoles.DELETE_USERS,
  UserRoles.EDIT_USER_ROLES,
  UserRoles.CHANGE_ORG_SETTINGS,
];

export const OrgMemberRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS,
];

export const OrgCurrencies = {
  EUR: 'EUR',
  GBP: 'GBP',
  USD: 'USD',
};

const getDefaultGuideline = (type, problemType) => (
  `Please go to Organization Settings to define what a ${type} ${problemType} means in your organization.`);

const defaultRiskScoringGuideline = 'Please go to Organization settings and provide a brief summary of how Risks should be scored in your organization.';

export const OrganizationDefaults = {
  workflowDefaults: {
    minorProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
    },
    majorProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
    },
    criticalProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS,
      },
    },
  },
  reminders: {
    minorNc: {
      start: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
      interval: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
      until: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
    },
    majorNc: {
      start: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
      interval: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
      until: {
        timeValue: 4,
        timeUnit: TimeUnits.DAYS,
      },
    },
    criticalNc: {
      start: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS,
      },
      interval: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS,
      },
      until: {
        timeValue: 6,
        timeUnit: TimeUnits.DAYS,
      },
    },
    improvementPlan: {
      start: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
      interval: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
      until: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
    },
  },
  ncGuidelines: {
    minor: getDefaultGuideline(ProblemMagnitudes.MINOR, ProblemTypes.NON_CONFORMITY),
    major: getDefaultGuideline(ProblemMagnitudes.MAJOR, ProblemTypes.NON_CONFORMITY),
    critical: getDefaultGuideline(ProblemMagnitudes.CRITICAL, ProblemTypes.NON_CONFORMITY),
  },
  rkGuidelines: {
    minor: getDefaultGuideline(ProblemMagnitudes.MINOR, ProblemTypes.RISK),
    major: getDefaultGuideline(ProblemMagnitudes.MAJOR, ProblemTypes.RISK),
    critical: getDefaultGuideline(ProblemMagnitudes.CRITICAL, ProblemTypes.RISK),
  },
  rkScoringGuidelines: defaultRiskScoringGuideline,
  review: {
    risks: {
      frequency: {
        timeValue: 12,
        timeUnit: TimeUnits.MONTHS,
      },
      reminders: {
        start: {
          timeValue: 2,
          timeUnit: TimeUnits.WEEKS,
        },
        interval: {
          timeValue: 1,
          timeUnit: TimeUnits.WEEKS,
        },
        until: {
          timeValue: 4,
          timeUnit: TimeUnits.WEEKS,
        },
      },
    },
    standards: {
      frequency: {
        timeValue: 12,
        timeUnit: TimeUnits.MONTHS,
      },
      reminders: {
        start: {
          timeValue: 2,
          timeUnit: TimeUnits.WEEKS,
        },
        interval: {
          timeValue: 1,
          timeUnit: TimeUnits.WEEKS,
        },
        until: {
          timeValue: 4,
          timeUnit: TimeUnits.WEEKS,
        },
      },
    },
  },
};

export const StandardTitles = [
  'Standards',
  'Compliance standards',
  'Compliance manual',
  'Quality standards',
  'Quality manual',
];

export const RiskTitles = [
  'Risk register',
  'Risk records',
  'Risks',
];

export const NonConformitiesTitles = [
  'Non-conformities',
  'Exceptions',
];

export const WorkInboxTitles = [
  'Work inbox',
  'Work items',
  'Work',
];

export const HomeScreenTitlesTypes = {
  STANDARDS: 'standards',
  RISKS: 'risks',
  NON_CONFORMITIES: 'nonConformities',
  WORK_INBOX: 'workInbox',
};

export const EmailsForPlioReporting = [
  'james.ives@pliohub.com',
  'steve.ives@pliohub.com',
  'mike@jssolutionsdev.com',
];

export const FILE_STATUS_MAP = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  TERMINATED: 'terminated',
  FAILED: 'failed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const CustomerTypes = {
  PAYING_SUBSCRIBER: 1,
  FREE_TRIAL: 2,
  TEST_ACCOUNT: 3,
};

export const CustomerTypesNames = {
  [CustomerTypes.PAYING_SUBSCRIBER]: 'Paying subscriber',
  [CustomerTypes.FREE_TRIAL]: 'Free trial',
  [CustomerTypes.TEST_ACCOUNT]: 'Test account',
};

export const PossibleReviewFrequencies = [
  {
    timeValue: 3,
    timeUnit: TimeUnits.DAYS,
  },
  {
    timeValue: 1,
    timeUnit: TimeUnits.WEEKS,
  },
  {
    timeValue: 6,
    timeUnit: TimeUnits.MONTHS,
  },
  {
    timeValue: 12,
    timeUnit: TimeUnits.MONTHS,
  },
  {
    timeValue: 24,
    timeUnit: TimeUnits.MONTHS,
  },
];

export const MessageTypes = {
  TEXT: 'text',
  FILE: 'file',
};
