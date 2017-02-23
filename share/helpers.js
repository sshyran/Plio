import { check } from 'meteor/check';
import get from 'lodash.get';
import moment from 'moment-timezone';
import Handlebars from 'handlebars';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

import {
  AvatarPlaceholders,
  CollectionNames,
  DocumentTypes,
  ProblemMagnitudes,
  SystemName,
  DocumentTypesPlural,
  AllDocumentTypes,
} from './constants.js';
import { Actions } from './collections/actions.js';
import { NonConformities } from './collections/non-conformities.js';
import { Risks } from './collections/risks.js';
import { Standards } from './collections/standards.js';
import { Organizations } from './collections/organizations';
import { Discussions } from './collections/discussions';


export const capitalize = str => `${str}`.charAt(0).toUpperCase() + `${str}`.substring(1);

export const lowercase = str => `${str}`.charAt(0).toLowerCase() + `${str}`.substring(1);

export const deepExtend = (dest, src) => {
  _(src).each((val, key) => {
    if (_(val).isObject() && _(dest[key]).isObject()) {
      deepExtend(dest[key], val);
    } else {
      dest[key] = val;
    }
  });
};

export const getCollectionByName = (colName) => {
  const collections = {
    [CollectionNames.ACTIONS]: Actions,
    [CollectionNames.NCS]: NonConformities,
    [CollectionNames.RISKS]: Risks,
    [CollectionNames.STANDARDS]: Standards,
    [CollectionNames.ORGANIZATIONS]: Organizations,
  };

  return collections[colName];
};

export const getCollectionByDocType = (docType) => {
  switch (docType) {
    case AllDocumentTypes.STANDARD:
      return Standards;

    case AllDocumentTypes.NON_CONFORMITY:
      return NonConformities;

    case AllDocumentTypes.RISK:
      return Risks;

    case AllDocumentTypes.CORRECTIVE_ACTION:
    case AllDocumentTypes.PREVENTATIVE_ACTION:
    case AllDocumentTypes.RISK_CONTROL:
      return Actions;

    case AllDocumentTypes.DISCUSSION:
      return Discussions;

    default:
      return undefined;
  }
};

export const getCollectionNameByDocType = (docType) => ({
  [DocumentTypes.STANDARD]: CollectionNames.STANDARDS,
  [DocumentTypes.NON_CONFORMITY]: CollectionNames.NCS,
  [DocumentTypes.RISK]: CollectionNames.RISKS,
})[docType];

export const getFormattedDate = (date, stringFormat) => {
  let format = stringFormat;
  if (typeof format !== 'string') format = 'DD MMM YYYY';
  return moment(date).format(format);
};

export const getDocTypePlural = (docType) => ({
  [DocumentTypes.STANDARD]: DocumentTypesPlural.STANDARDS,
  [DocumentTypes.RISK]: DocumentTypesPlural.RISKS,
  [DocumentTypes.NON_CONFORMITY]: DocumentTypesPlural.NON_CONFORMITIES,
})[docType];

export const getLinkedDoc = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  return collection.findOne({ _id: documentId });
};

export const getRandomAvatarUrl = () => {
  const randomAvatarIndex = Math.floor(Math.random() * 16);
  return AvatarPlaceholders[randomAvatarIndex];
};

export const getTitlePrefix = (title) => {
  let titlePrefix;
  const matchedPrefixArray = title.match(/^[\d\.]+/g);

  if (matchedPrefixArray && matchedPrefixArray.length) {
    const stringPrefix = matchedPrefixArray[0];

    // Convert 1.2.3.4 to 1.2345 for sorting purposes
    const stringPrefixFloat = stringPrefix.replace(/^([^.]*\.)(.*)$/, function (a, b, c) {
      return b + c.replace(/\./g, '');
    });
    titlePrefix = parseFloat(stringPrefixFloat);

    if (!titlePrefix && titlePrefix !== 0) {
      titlePrefix = title;
    }
  } else {
    titlePrefix = title;
  }

  return titlePrefix;
};

export const getTzTargetDate = (targetDate, timezone) => targetDate && moment.tz([
  targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(),
], timezone).toDate();

export const getFormattedTzDate = (timezone, format = 'z Z') =>
  moment.tz(timezone).format(format);

export const getWorkflowDefaultStepDate = ({ organization, linkedTo }) => {
  let magnitude = ProblemMagnitudes.MINOR;

  // Select the highest magnitude among all linked documents
  _.each(linkedTo, ({ documentId, documentType }) => {
    const collection = getCollectionByDocType(documentType);
    const doc = collection.findOne({ _id: documentId });
    if (magnitude === ProblemMagnitudes.CRITICAL) {
      return;
    }

    if (doc.magnitude === ProblemMagnitudes.MINOR) {
      return;
    }

    magnitude = doc.magnitude;
  });

  const workflowStepTime = organization.workflowStepTime(magnitude);
  const { timeValue, timeUnit } = workflowStepTime;
  const date = moment()
      .tz(organization.timezone)
      .startOf('day')
      .add(timeValue, timeUnit)
      .toDate();

  return date;
};

export const generateSerialNumber = (collection, query = {}, defaultNumber = 1) => {
  check(defaultNumber, Number);

  const last = collection.findOne({
    ...query,
    serialNumber: {
      $type: 16, // 32-bit integer
    },
  }, {
    sort: {
      serialNumber: -1,
    },
  });

  return last ? last.serialNumber + 1 : defaultNumber;
};

export const generateUserInitials = (userProfile) => {
  const { firstName, lastName } = userProfile;
  let initials = '';
  if (firstName) {
    initials += firstName.charAt(0);
  }

  if (lastName) {
    initials += lastName.charAt(0);
  }

  return initials.toUpperCase();
};

const checkTargetDate = (targetDate, timezone) => {
  if (!targetDate) {
    return false;
  }

  timezone = timezone || moment.tz.guess();

  const tzNow = moment().tz(timezone);
  const tzTargetDate = moment(targetDate).tz(timezone);

  if (tzNow.isAfter(tzTargetDate, 'day')) {
    return 1;
  } else if (tzNow.isSame(tzTargetDate, 'day')) {
    return 0;
  } else if (tzNow.isBefore(tzTargetDate, 'day')) {
    return -1;
  }
};

export const isDueToday = (targetDate, timezone) => checkTargetDate(targetDate, timezone) === 0;

export const isOverdue = (targetDate, timezone) => checkTargetDate(targetDate, timezone) === 1;

export const renderTemplate = (template, data = {}) => {
  const compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(data);
};

export const getUser = (userId) => Meteor.users.findOne({ _id: userId });

export const getUserFullNameOrEmail = (userOrId) => {
  let user = userOrId;
  if (typeof userOrId === 'string') {
    if (userOrId === SystemName) {
      return userOrId;
    }

    user = getUser(userOrId);
  }

  return (user && user.fullNameOrEmail()) || '';
};

export const htmlToPlainText = (html) => {
  check(html, String);

  return html.replace(/<br>/gi, '\n')
    .replace(/<p.*>/gi, '\n')
    .replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, ' $2 (Link->$1) ')
    .replace(/<(?:.|\s)*?>/g, '')
    .trim();
};

export const sanitizeFilename = (str) => {
  check(str, String);

  return str.replace(/[^a-z0-9.]/gi, '_').replace(/_{2,}/g, '_');
};

export const getDocByIdAndType = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  return collection && collection.findOne({ _id: documentId });
};

export const getReviewConfig = (organization, documentType) => {
  const documentKey = {
    [DocumentTypes.STANDARD]: 'standards',
    [DocumentTypes.RISK]: 'risks',
  }[documentType];

  return get(organization, `review.${documentKey}`);
};
