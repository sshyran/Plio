import {
  compose,
  mapProps,
  branch,
  renderComponent,
  shouldUpdate,
} from 'recompose';
import { connect } from 'react-redux';

import {
  some,
  getC,
  lengthStandards,
  notEquals,
  omitC,
  pickDeep,
  identity,
  pickC,
  assoc,
} from '/imports/api/helpers';
import StandardsRHS from '../../components/RHS';
import { getStandardsByFilter } from '../../helpers';

const mapStateToProps = state => ({
  ...pickC(['isFullScreenMode', 'isCardReady', 'urlItemId'])(state.global),
  standard: state.collections.standardsByIds[state.global.urlItemId],
});

export default compose(
  connect(pickDeep([
    'global.filter',
    'global.searchText',
    'collections.standards',
    'standards.standardsFiltered',
  ])),
  mapProps(props => assoc('standards', getStandardsByFilter(props), props)),
  branch(
    props => lengthStandards(props),
    identity,
    renderComponent(StandardsRHS.NotFound),
  ),
  branch(
    props => props.searchText && !props.standardsFiltered.length,
    renderComponent(StandardsRHS.NoResults),
    identity,
  ),
  connect(mapStateToProps),
  mapProps(({
    isCardReady,
    standard,
    standards,
    ...props
  }) => ({
    ...props,
    standard,
    isCardReady,
    isReady: !!(isCardReady && standards.length && standard),
  })),
  branch(
    props => props.isCardReady && props.urlItemId && !props.standard,
    renderComponent(StandardsRHS.NotExist),
    identity,
  ),
  shouldUpdate((props, nextProps) => {
    const omitStandardKeys = omitC(['updatedAt']);
    return !!(
      props.isReady !== nextProps.isReady ||
      props.isFullScreenMode !== nextProps.isFullScreenMode ||
      notEquals(omitStandardKeys(props.standard), omitStandardKeys(nextProps.standard))
    );
  }),
  mapProps((props) => {
    const hasDocxAttachment = some([
      getC('source1.htmlUrl'),
      getC('source2.htmlUrl'),
    ], props.standard);

    return {
      ...props,
      hasDocxAttachment,
    };
  }),
)(StandardsRHS);
