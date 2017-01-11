import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { createWriteStream } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import moment from 'moment-timezone';
import Future from 'fibers/future';
import csv from 'fast-csv';

import * as Mapping from './mapping';
import DataAggregator from './DataAggregator';
import { getCreatedFileTime, createMd5Hash } from './helpers';
import { isOrgMember } from '../checkers';
import Method from '../method';
import { ORG_MUST_BE_MEMBER } from '../organizations/errors';
import { IdSchema } from '/imports/share/schemas/schemas';


function createFileInfo(orgName, docType) {
  const filteredOrgName = orgName.replace(/\W/g, '');
  const date = moment().format('D-MMM-YYYY');
  const name = `${filteredOrgName}-${docType}-Data-Export-${date}.csv`;
  const path = join(tmpdir(), name);

  return { name, path };
}

function saveData(file, fields, mapping, data) {
  const streamFuture = new Future();
  const stream = createWriteStream(file.path);
  const writer = csv
    .format({ headers: true, quoteColumns: true })
    .transform((row) => _.object(
      fields.map(field => mapping.fields[field].label),
      fields.map(field => {
        const { format } = mapping.fields[field];

        return _.isFunction(format) && format(row[field]) || row[field];
      }),
    ));

  writer.on('finish', () => streamFuture.return({
    fileName: file.name,
    token: createMd5Hash(getCreatedFileTime(file.path)),
    debugData: {
      file,
      createdTime: getCreatedFileTime(file.path),
    },
  }));

  writer.pipe(stream);
  data.fetch().forEach(entity => writer.write(entity));
  writer.end();

  return streamFuture.wait();
}

export const generateLink = new Method({
  name: 'DataExport.generateLink',

  validate({ org, docType, fields, filters }) {
    const docTypeSchema = new SimpleSchema({
      docType: {
        type: String,
        allowedValues: Object.keys(Mapping),
      },
    });

    docTypeSchema.validate({ docType });

    const argsSchema = new SimpleSchema({
      org: {
        type: new SimpleSchema([
          IdSchema,
          { name: { type: String } },
        ]),
      },
      fields: {
        type: [String],
        allowedValues: Object.keys(Mapping[docType].mapping.fields),
      },
      filters: {
        type: [Number],
      },
    });

    argsSchema.validate({ org, fields, filters });

    if (!isOrgMember(this.userId, org._id)) {
      throw ORG_MUST_BE_MEMBER;
    }
  },

  run({ org, docType, fields, filters }) {
    const { mapping } = Mapping[docType];
    const file = createFileInfo(org.name, docType);

    // get field order from mapping
    const sortedFields = _.intersection(Object.keys(mapping.fields), fields);
    const dataAggregator = new DataAggregator(
      fields,
      filters,
      mapping,
      org._id
    );

    return saveData(file, sortedFields, mapping, dataAggregator);
  },
});

