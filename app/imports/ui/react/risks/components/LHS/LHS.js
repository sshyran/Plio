import React from 'react';
import { ListGroup } from 'reactstrap';

import { RiskFilterIndexes } from '/imports/api/constants';
import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import TypeListContainer from '../../containers/TypeListContainer';
import DepartmentListContainer from '../../containers/DepartmentListContainer';
import StatusListContainer from '../../containers/StatusListContainer';
import DeletedRisksListContainer from '../../containers/DeletedRisksListContainer';

const RisksLHS = ({
  filter,
  onToggleCollapse,
  risks,
  animating,
  searchText,
  searchResultsText,
  onClear,
  onSearchTextChange: onChange,
  onModalOpen: onModalButtonClick,
}) => {
  const renderContent = () => {
    switch (filter) {
      case RiskFilterIndexes.TYPE:
      default:
        return (<TypeListContainer {...{ risks, onToggleCollapse }} />);
      case RiskFilterIndexes.STATUS:
        return (<StatusListContainer {...{ risks, onToggleCollapse }} />);
      case RiskFilterIndexes.DEPARTMENT:
        return (<DepartmentListContainer {...{ risks, onToggleCollapse }} />);
      case RiskFilterIndexes.DELETED:
        return (
          <ListGroup>
            <DeletedRisksListContainer {...{ risks }} />
          </ListGroup>
        );
    }
  };

  return (
    <LHSContainer
      {...{ animating, searchText, searchResultsText, onChange, onClear, onModalButtonClick }}
    >
      {renderContent()}
    </LHSContainer>
  );
};

RisksLHS.propTypes = propTypes;

export default RisksLHS;
