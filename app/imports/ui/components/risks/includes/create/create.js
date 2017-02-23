import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { insert } from '/imports/api/risks/methods.js';
import { setModalError, inspire } from '/imports/api/helpers.js';

Template.Risks_Create.viewmodel({
  mixin: ['organization', 'router', 'getChildrenData'],
  isStandardsEditable: true,
  standardsIds: [],
  RKGuidelines() {
    return this.organization() && this.organization().rkGuidelines;
  },
  save() {
    const data = this.getData();

    for (let key in data) {
      if (!data[key]) {
        if (key === 'title') {
          errorMessage = `The new risk cannot be created without a title. Please enter a title for your risk`;
          setModalError(errorMessage);
          return;
        } else if (key === 'sectionId') {
          errorMessage = `The new risk cannot be created without a section. You can create a new section by typing it's name into the corresponding text input`;
          setModalError(errorMessage);
          return;
        } else if (key === 'typeId') {
          errorMessage = `The new standard cannot be created without a type. You can create a new risk type in Org settings`;
          setModalError(errorMessage);
          return;
        } else {
          const errorMessage = `The new risk cannot be created without a ${key}. Please enter a ${key} for your risk.`;
          setModalError(errorMessage);
          return;
        }
      }
    }

    this.insert(data);
  },
  insert({ ...args }) {
    const allArgs = {
      ...args,
      ...inspire(['organizationId'], this)
    };

    const cb = (_id, open) => {
      this.goToRisk(_id, false);

      open({
        _id,
        _title: 'Risk',
        template: 'Risks_Card_Edit',
      });
    };

    invoke(this.card, 'insert', insert, allArgs, cb);
  },
  getData() {
    return this.getChildrenData();
  }
});
