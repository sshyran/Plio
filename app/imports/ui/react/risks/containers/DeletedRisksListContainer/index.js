import RisksListContainer from '../RisksListContainer';
import {
  handleRisksRedirectAndOpen,
  withRisksRedirectAndOpen,
} from '../../helpers';

const redirect = ({ risks, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  () => null,
  [{ risks }],
  risksByIds,
  props,
);

export default withRisksRedirectAndOpen(redirect)(RisksListContainer);
