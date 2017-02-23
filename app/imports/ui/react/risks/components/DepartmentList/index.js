import React, { PropTypes } from 'react';
import cx from 'classnames';

import { CollectionNames } from '/imports/share/constants';
import createTypeItem from '../../../helpers/createTypeItem';
import LHSItemContainer from '../../../containers/LHSItemContainer';
import RisksListContainer from '../../containers/RisksListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';

const TypeList = ({ departments, onToggleCollapse }) => (
  <div>
    {departments.map(department => (
      <LHSItemContainer
        key={department._id}
        item={createTypeItem(CollectionNames.DEPARTMENTS, department._id)}
        // TODO: move to separated helper
        lText={cx(department.name)}
        rText={department.unreadMessagesCount && (
          <LabelMessagesCount count={department.unreadMessagesCount} />
        )}
        hideRTextOnCollapse
        onToggleCollapse={onToggleCollapse}
      >
        <div className="sub">
          <RisksListContainer risks={department.risks} />
        </div>
      </LHSItemContainer>
    ))}
  </div>
);

TypeList.propTypes = {
  departments: PropTypes.array.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default TypeList;
