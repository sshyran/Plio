import { CollectionNames } from '../constants.js';
import AuditService from '/imports/core/audit/audit-service.js';
import RiskUpdateAudit from './RiskUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.RISKS,

  _updateAuditConstructor: RiskUpdateAudit,

  _documentCreatedMessage: 'Risk created',

  _documentRemovedMessage: 'Risk removed'
});
