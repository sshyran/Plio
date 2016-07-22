import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import WorkItemService from './work-item-service.js';
import { WorkItemSchema } from './work-item-schema.js';
import { WorkItems } from './work-items.js';
import { IdSchema } from '../schemas.js';
import { WorkItemTypes } from '../constants.js';

export const remove = new ValidatedMethod({
  name: 'WorkItems.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a work item'
      );
    }

    return WorkItemService.remove({ _id, deletedBy: userId });
  }
});

export const restore = new ValidatedMethod({
  name: 'WorkItems.restore',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot restore a work item'
      );
    }

    return WorkItemService.restore({ _id });
  }
});
