import React, { PropTypes } from 'react';
import { CardBlock } from 'reactstrap';

import { OrganizationSettingsHelp } from '/imports/api/help-messages';
import withStateCollapsed from '/imports/ui/react/helpers/withStateCollapsed';
import CardBlockCollapse from '/imports/ui/react/components/CardBlockCollapse';
import HelpPanel from '/imports/ui/react/components/HelpPanel';
import HomeScreenTitle from '../../fields/edit/components/HomeScreenTitle';
import {
  StandardTitles,
  RiskTitles,
  NonConformitiesTitles,
  WorkInboxTitles,
} from '/imports/share/constants';
import { createWorkspaceTitleValue } from '../../helpers';
import { equals } from '/imports/api/helpers';

const ITEM_MAP = {
  standards: {
    label: 'Standards',
    items: StandardTitles,
  },
  risks: {
    label: 'Risk register',
    items: RiskTitles,
  },
  nonConformities: {
    label: 'Non-conformities',
    items: NonConformitiesTitles,
  },
  workInbox: {
    label: 'Work inbox',
    items: WorkInboxTitles,
  },
};
const HelpPanelEnhanced = withStateCollapsed(true)(HelpPanel);

const HomeTitlesSubcard = ({
  loading,
  onSelectTitle: onSelect,
  organization: { homeScreenTitles: titles = {} } = {},
}) => {
  const fields = Object.keys(ITEM_MAP).map((key) => {
    // we need a key for a method and a value to know which title is selected
    const currentItem = ITEM_MAP[key];
    const selectedTitle = titles[key];
    const newSelectedTitle = !!titles[key] && !currentItem.items.find(equals(selectedTitle))
     ? [{
       text: selectedTitle,
       value: createWorkspaceTitleValue(key, selectedTitle),
     }]
     : null;

    const items = currentItem.items.map((title) => ({
      text: title,
      value: createWorkspaceTitleValue(key, title),
    })).concat(newSelectedTitle || []);

    return (
      <HomeScreenTitle
        {...{ ...currentItem, key, items, onSelect }}
        id={key}
        selected={createWorkspaceTitleValue(key, selectedTitle)}
        input={{ placeholder: 'Select a title...' }}
      />
    );
  });

  return (
    <CardBlockCollapse leftText="Workspace titles" {...{ loading }}>
      <CardBlock>
        {fields}
      </CardBlock>

      <HelpPanelEnhanced showIconAlways>
        {OrganizationSettingsHelp.homeScreenTitles}
      </HelpPanelEnhanced>
    </CardBlockCollapse>
  );
};

HomeTitlesSubcard.propTypes = {
  loading: PropTypes.bool,
  organization: PropTypes.object,
  onSelectTitle: PropTypes.func,
};

export default HomeTitlesSubcard;
