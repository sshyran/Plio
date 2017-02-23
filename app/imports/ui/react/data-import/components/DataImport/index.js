import React, { PropTypes } from 'react';
import { ListGroup } from 'reactstrap';

import { DocumentTypes } from '/imports/share/constants';
import CardBlockCollapse from '../../../components/CardBlockCollapse';
import OrganizationList from '../OrganizationList';

const ModalDataImport = ({
  documentType,
  onOrgClick,
  List = OrganizationList,
  children,
  ...other
}) => (
  <div className="relative">
    <ListGroup className="list-group-flush">
      {children}
      <CardBlockCollapse leftText="Setup a bulk insert from other organization" {...other}>
        <List {...{ documentType, onOrgClick, ...other }} />
      </CardBlockCollapse>
    </ListGroup>
  </div>
);

ModalDataImport.propTypes = {
  documentType: PropTypes.oneOf(Object.values(DocumentTypes)).isRequired,
  label: PropTypes.string,
  List: PropTypes.func,
  onOrgClick: PropTypes.func,
  onFirstDocAdd: PropTypes.func,
  getDocsCount: PropTypes.func,
  onSuccess: PropTypes.func,
  children: PropTypes.node,
};

export default ModalDataImport;
