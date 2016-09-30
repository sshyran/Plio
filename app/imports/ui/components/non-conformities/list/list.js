import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';
import property from 'lodash.property';
import curry from 'lodash.curry';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import {
  extractIds, inspire, findById,
  lengthItems, flattenMapItems
} from '/imports/api/helpers.js';

Template.NC_List.viewmodel({
  mixin: [
    'collapsing', 'organization', 'modal', 'magnitude',
    'nonconformity', 'router', 'utils', 'currency', 'problemsStatus',
  ],
  autorun() {
    if (!this.list.focused() && !this.list.animating() && !this.list.searchText()) {
      const { result:contains, first:defaultDoc } = this._findNCForFilter(this.NCId());

      if (!contains) {
        if (defaultDoc) {
          const { _id } = defaultDoc;

          Meteor.setTimeout(() => {
            this.goToNC(_id);
            this.expandCollapsed(_id);
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            this.goToNCs();
          }, 0);
        }
      }
    }
  },
  _findNCForFilter(_id) {
    const { magnitude, statuses, departments, deleted } = inspire(
      ['magnitude', 'statuses', 'departments', 'deleted'],
      this
    );
    const finder = findById(_id);
    const results = curry((transformer, array) => {
      const items = transformer(array);
      return {
        result: finder(items),
        first: _.first(items),
        array: items
      };
    });
    const resulstsFromItems = results(flattenMapItems);

    switch(this.activeNCFilterId()) {
      case 1:
        return resulstsFromItems(magnitude);
        break;
      case 2:
        return resulstsFromItems(statuses);
        break;
      case 3:
        return resulstsFromItems(departments);
        break;
      case 4:
        return results(_.identity, deleted);
        break;
      default:
        return {};
        break;
    }
  },
  magnitude() {
    const mapper = (m) => {
      const query = { magnitude:m.value, ...this._getSearchQuery() };
      const items = this._getNCsByQuery(query, this._getSearchOptions()).fetch();

      return { ...m, items };
    };

    return this._magnitude().map(mapper).filter(lengthItems);
  },
  calculateTotalCost(items) {
    const total = items.reduce((prev, { _id:nonConformityId, cost } = {}) => {
      const occurrences = Occurrences.find({ nonConformityId }).fetch();
      const t = cost * occurrences.length || 0;
      return prev + t;
    }, 0);

    const { currency } = Object.assign({}, this.organization());

    return total ? this.getCurrencySymbol(currency) + this.round(total) : '';
  },
  onSearchInputValue() {
    return value => extractIds(this._findNCForFilter().array);
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Non-conformity',
        template: 'NC_Create',
        variation: 'save'
      });
  }
});
