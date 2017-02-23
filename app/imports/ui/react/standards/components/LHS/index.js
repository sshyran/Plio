import React, { PropTypes } from 'react';
import { ListGroup } from 'reactstrap';

import { DocumentTypes } from '/imports/share/constants';
import LHSContainer from '../../../containers/LHSContainer';
import SectionListContainer from '../../containers/SectionListContainer';
import TypeListContainer from '../../containers/TypeListContainer';
import DeletedStandardListContainer from '../../containers/DeletedStandardListContainer';
import ModalHandle from '../../../components/ModalHandle';
import DataImportContainer from '../../../data-import/containers/DataImportContainer';
import Field from '../../../fields/read/components/Field';

const propTypes = {
  filter: PropTypes.number,
  standards: PropTypes.arrayOf(PropTypes.object),
  onToggleCollapse: PropTypes.func,
  animating: PropTypes.bool,
  searchText: PropTypes.string,
  searchResultsText: PropTypes.string,
  onSearchTextChange: PropTypes.func,
  onClear: PropTypes.func,
  onModalOpen: PropTypes.func,
  isDataImportModalOpened: PropTypes.bool,
  getDocsCount: PropTypes.func,
  onDataImportSuccess: PropTypes.func,
  onDataImportModalClose: PropTypes.func,
  openDocumentCreationModal: PropTypes.func,
};

const StandardsLHS = ({
  filter,
  standards,
  onToggleCollapse,
  animating,
  searchText,
  searchResultsText,
  onSearchTextChange,
  onClear,
  onModalOpen,
  isDataImportModalOpened,
  getDocsCount,
  onDataImportSuccess,
  onDataImportModalClose,
  openDocumentCreationModal,
}) => {
  let content;

  switch (filter) {
    case 1:
    default:
      content = (
        <SectionListContainer {...{ standards, onToggleCollapse }} />
      );
      break;
    case 2:
      content = (
        <TypeListContainer {...{ standards, onToggleCollapse }} />
      );
      break;
    case 3:
      content = (
        <ListGroup>
          <DeletedStandardListContainer {...{ standards }} />
        </ListGroup>
      );
      break;
  }

  return (
    <LHSContainer
      {...{ animating, searchText, searchResultsText, onClear }}
      onChange={onSearchTextChange}
      onModalButtonClick={onModalOpen}
    >
      {content}

      <ModalHandle
        title="Add"
        isOpened={isDataImportModalOpened}
        onModalClose={onDataImportModalClose}
      >
        <DataImportContainer
          {...{ getDocsCount }}
          documentType={DocumentTypes.STANDARD}
          onSuccess={onDataImportSuccess}
        >
          <Field tag="button" onClick={openDocumentCreationModal}>
            Add a first standard document
          </Field>
        </DataImportContainer>
      </ModalHandle>
    </LHSContainer>
  );
};

StandardsLHS.propTypes = propTypes;

export default StandardsLHS;
