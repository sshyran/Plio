import { _ } from 'meteor/underscore';
import { withProps } from 'recompose';
import curry from 'lodash.curry';

import { CollectionNames } from '/imports/share/constants';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import {
  compose,
  find,
  propStandards,
  propSections,
  propEqId,
  propId,
  propEq,
  getC,
  notDeleted,
  getId,
  propEqKey,
} from '/imports/api/helpers';
import { addCollapsed, chainActions } from '/imports/client/store/actions/globalActions';
import { goTo } from '../../utils/router/actions';
import createTypeItem from '../helpers/createTypeItem';
import store, { getState } from '/imports/client/store';
import { SECTION_UNCATEGORIZED, TYPE_UNCATEGORIZED } from './constants';

export const getSubNestingClassName = ({ nestingLevel = 1 }) =>
  'sub'.repeat(parseInt(nestingLevel, 10) - 1);

export const createSectionItem = key => ({
  key,
  type: CollectionNames.STANDARD_BOOK_SECTIONS,
});

export const createStandardTypeItem = curry(createTypeItem)(CollectionNames.STANDARD_TYPES);

export const findSelectedStandard = id =>
  compose(find(propEqId(id)), propStandards);

export const findSelectedSection = id =>
  compose(find(findSelectedStandard(id)), propSections);

export const getStandardsByFilter = ({ filter, standards }) => (
  filter === STANDARD_FILTER_MAP.DELETED
    ? standards.filter(propEq('isDeleted', true))
    : standards.filter(notDeleted)
);

export const addCollapsedType = compose(addCollapsed, createStandardTypeItem, propId);

export const addCollapsedSection = compose(addCollapsed, createSectionItem, propId);

export const createUncategorizedSection = ({ standards, sections }) => ({
  _id: SECTION_UNCATEGORIZED,
  title: 'Uncategorized',
  organizationId: getC('organizationId', standards[0]),
  standards: standards.filter(standard => !sections.find(propEqId(standard.sectionId))),
});

export const createUncategorizedType = ({ standards, types }) => ({
  _id: TYPE_UNCATEGORIZED,
  title: 'Uncategorized',
  organizationId: getC('organizationId', standards[0]),
  standards: standards.filter(standard => !types.find(propEqId(standard.typeId))),
});

export const getSelectedAndDefaultStandardByFilter = ({
  sections, types, standards, filter, urlItemId,
}) => {
  const findStandard = findSelectedStandard(urlItemId);
  switch (filter) {
    case STANDARD_FILTER_MAP.SECTION: {
      const containedIn = sections.find(findStandard);
      return {
        containedIn,
        selectedStandard: findStandard(containedIn),
        defaultStandard: getC('sections[0].standards[0]', { sections }),
        defaultContainedIn: _.first(sections),
      };
    }
    case STANDARD_FILTER_MAP.TYPE: {
      const containedIn = types.find(findStandard);
      return {
        containedIn,
        selectedStandard: findStandard(containedIn),
        defaultStandard: getC('types[0].standards[0]', { types }),
        defaultContainedIn: _.first(types),
      };
    }
    case STANDARD_FILTER_MAP.DELETED:
    default:
      return {
        selectedStandard: findStandard({ standards }),
        defaultStandard: getC('standards[0]', { standards }),
        containedIn: null,
        defaultContainedIn: null,
      };
  }
};

export const redirectToStandardOrDefault = ({
  selectedStandard,
  defaultStandard,
}) => !selectedStandard && (
  defaultStandard
    ? goTo('standard')({ urlItemId: getId(defaultStandard) })
    : goTo('standards')()
);

export const openStandardByFilter = ({
  selectedStandard,
  containedIn,
  defaultContainedIn,
  filter,
  dispatch,
}) => {
  const parentItem = selectedStandard ? containedIn : defaultContainedIn;
  const topLevelKey = getId(parentItem);
  let result;

  switch (filter) {
    case 1:
    default: {
      const sectionItem = createSectionItem(topLevelKey);
      result = dispatch(addCollapsed({ ...sectionItem, close: { type: sectionItem.type } }));
      break;
    }
    case 2: {
      const typeItem = createStandardTypeItem(topLevelKey);
      result = dispatch(addCollapsed({ ...typeItem, close: { type: typeItem.type } }));
      break;
    }
    case 3:
      result = null;
      break;
  }

  return result;
};

export const expandCollapsedStandard = (_id) => {
  const {
    global: { filter },
    collections: {
      standardsByIds,
      standardBookSectionsByIds,
      standardTypesByIds,
    },
  } = getState();
  const standard = { ...standardsByIds[_id] };
  const sectionId = standardBookSectionsByIds[standard.sectionId]
    ? standard.sectionId
    : SECTION_UNCATEGORIZED;
  const typeId = standardTypesByIds[standard.typeId] ? standard.typeId : TYPE_UNCATEGORIZED;
  const sectionItem = createSectionItem(sectionId);
  const typeItem = createStandardTypeItem(typeId);
  let action;

  switch (filter) {
    case STANDARD_FILTER_MAP.SECTION:
      action = addCollapsed({ ...sectionItem, close: { type: sectionItem.type } });
      break;
    case STANDARD_FILTER_MAP.TYPE:
      action = chainActions(
        [typeItem, sectionItem].map(item => addCollapsed({ ...item, close: { type: item.type } }))
      );
      break;
    default:
      return false;
  }

  return store.dispatch(action);
};

export const expandCollapsedStandards = (ids) => {
  const {
    collections: { standards, standardBookSections, standardTypes },
    global: { filter, collapsed },
  } = getState();

  const notCollapsed = _id => !collapsed.find(propEqKey(_id)); // reject already expanded
  const standardsFound = standards.filter(standard => ids.includes(standard._id));
  const uncategorizedSection = createUncategorizedSection({
    sections: standardBookSections,
    standards: standardsFound,
  });
  let sections = standardBookSections.filter(section =>
    notCollapsed(section._id) &&
    standardsFound.filter(propEq('sectionId', section._id)).length
  );

  sections = uncategorizedSection.standards.length
    ? sections.concat(uncategorizedSection)
    : sections;

  switch (filter) {
    case STANDARD_FILTER_MAP.SECTION:
      return store.dispatch(chainActions(sections.map(addCollapsedSection)));
    case STANDARD_FILTER_MAP.TYPE: {
      const uncategorizedType = createUncategorizedType({
        standards: standardsFound,
        types: standardTypes,
      });
      let types = standardTypes.filter(type =>
        notCollapsed(type._id) &&
        standardsFound.filter(propEq('typeId', type._id)).length
      );

      types = uncategorizedType.standards.length
        ? types.concat(uncategorizedType)
        : types;

      return store.dispatch(chainActions(
        types.map(addCollapsedType).concat(sections.map(addCollapsedSection))
      ));
    }
    default:
      return false;
  }
};

export const collapseExpandedStandards = () => {
  const {
    collections: { standardsByIds, standardTypesByIds, standardBookSectionsByIds },
    global: { filter, urlItemId },
  } = getState();
  // expand section and type with currently selected standard and close others
  const selectedStandard = standardsByIds[urlItemId];

  if (!selectedStandard) return false;

  const selectedSection = standardBookSectionsByIds[selectedStandard.sectionId] ||
    { _id: SECTION_UNCATEGORIZED };
  const selectedSectionItem = createSectionItem(getId(selectedSection));
  const addClose = item => ({
    ...item,
    close: { type: item.type },
  });
  const sectionCollapseAction = addCollapsed(addClose(selectedSectionItem));

  switch (filter) {
    case STANDARD_FILTER_MAP.SECTION:
      // if standards are filtered by 'section'
      // collapse all sections except the one that is holding selected standard
      return store.dispatch(sectionCollapseAction);
    case STANDARD_FILTER_MAP.TYPE: {
      // if standards are filtered by 'type'
      // collapse all types and sections except the one that is holding selected standard
      const selectedType = standardTypesByIds[selectedStandard.typeId] ||
        { _id: TYPE_UNCATEGORIZED };
      const selectedTypeItem = createStandardTypeItem(getId(selectedType));
      const typeCollapseAction = addCollapsed(addClose(selectedTypeItem));

      return store.dispatch(chainActions([typeCollapseAction, sectionCollapseAction]));
    }
    default:
      return false;
  }
};

export const withStandard = withProps(props => ({
  standard: findSelectedStandard(props.urlItemId)(props),
}));

export const getSelectedStandardDeletedState = state => ({
  isSelectedStandardDeleted: getC(
    'isDeleted',
    state.collections.standardsByIds[state.global.urlItemId]
  ),
});
