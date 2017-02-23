const orgSerialNumber = true;
const filter = true;

export const PATH_MAP = {
  signOut: {},
  dashboardPage: { orgSerialNumber },
  standards: { orgSerialNumber, filter },
  standard: { orgSerialNumber, filter },
  standardDiscussion: { orgSerialNumber, filter },
  nonconformity: { orgSerialNumber, filter },
  risks: { orgSerialNumber, filter },
  risk: { orgSerialNumber, filter },
  riskDiscussion: { orgSerialNumber, filter },
  workInboxItem: { orgSerialNumber, filter },
  customers: {},
  customer: {},
  helpDocs: {},
  helpDoc: {},
};
