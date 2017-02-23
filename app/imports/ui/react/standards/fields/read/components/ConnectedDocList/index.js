import React, { PropTypes } from 'react';

import { ActionTypes } from '/imports/share/constants';
import { splitActionsByType } from '/imports/api/actions/helpers';
import LinkItemList from '../../../../../fields/read/components/LinkItemList';
import { getPath } from '../../../../../../utils/router/paths';
import { getClassByStatus } from '/imports/api/problems/helpers';

const ConnectedDocList = (props) => {
  const ncs = props.ncs.map(nc => ({
    ...nc,
    indicator: getClassByStatus(nc.status),
    href: getPath('nonconformity')({ urlItemId: nc._id }),
  }));
  const risks = props.risks.map(risk => ({
    ...risk,
    indicator: getClassByStatus(risk.status),
    href: getPath('risk')({ urlItemId: risk._id }),
  }));
  const actionsByType = splitActionsByType(props.actions);

  const lists = [
    {
      label: 'Non-conformities',
      items: [...ncs],
    },
    {
      label: 'Risks',
      items: [...risks],
    },
    {
      label: 'Corrective actions',
      items: [...actionsByType[ActionTypes.CORRECTIVE_ACTION]],
    },
    {
      label: 'Preventative actions',
      items: [...actionsByType[ActionTypes.PREVENTATIVE_ACTION]],
    },
  ];

  return (
    <div>
      {lists.map(({ label, items = [] }) => !!items.length && (
        <LinkItemList key={`list-${label}`} {...{ label, items }} />
      ))}
      {props.children}
      {props.lessons && !!props.lessons.length && (
        <LinkItemList label="Lessons Learned" items={props.lessons} />
      )}
    </div>
  );
};

ConnectedDocList.propTypes = {
  userId: PropTypes.string,
  ncs: PropTypes.array,
  risks: PropTypes.array,
  actions: PropTypes.array,
  workItems: PropTypes.array,
  lessons: PropTypes.array,
  children: PropTypes.node,
};

export default ConnectedDocList;
