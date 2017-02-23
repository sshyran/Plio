import React, { PropTypes } from 'react';
import { compose, withState, lifecycle, branch, renameProp } from 'recompose';
import property from 'lodash.property';
import { Input } from 'reactstrap';

import { omitProps } from '../../../helpers';

const enhance = compose(
  branch(
    property('uncontrolled'),
    compose(
      withState('internalValue', 'setInternalValue', property('value')),
      lifecycle({
        componentWillReceiveProps(nextProps) {
          if (this.props.value !== nextProps.value) {
            nextProps.setInternalValue(nextProps.value);
          }
        },
      }),
    ),
    renameProp('value', 'internalValue'),
  ),
  omitProps(['value', 'uncontrolled']),
);

const TextInput = enhance(({
  internalValue,
  onChange,
  setInternalValue,
  getRef,
  ...other
}) => (
  <Input
    value={internalValue}
    onChange={(e) => {
      if (typeof setInternalValue === 'function') {
        setInternalValue(e.target.value);
      }

      return typeof onChange === 'function' && onChange(e);
    }}
    {...{ ...other, getRef }}
  />
));

TextInput.propTypes = {
  uncontrolled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  getRef: PropTypes.func,
};

export default TextInput;
