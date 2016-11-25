import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';
import ClearableField from '../ClearableField';
import AddButton from '../AddButton';
import TextInput from '../../forms/components/TextInput';

const LHS = ({
  animating = false,
  isFocused = false,
  searchText = '',
  searchResultsText = '',
  children,
  onModalButtonClick,
  onClear,
  onFocus,
  onBlur,
  onChange,
}) => {
  let searchInput;

  return (
    <div className="card">
      <div className="search-form">
        <div
          className={cx(
            'form-group',
            'row',
            'with-loader',
            { loading: animating }
          )}
        >
          <ClearableField
            onClick={e => onClear && onClear(searchInput)(e)}
            animating={animating}
            isFocused={isFocused}
          >
            <TextInput
              value={searchText}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={animating}
              reference={input => (searchInput = input)}
              className="form-control"
              placeholder="Search..."
            />
          </ClearableField>

          {animating && (
            <i className="small-loader fa fa-circle-o-notch fa-spin"></i>
          )}
        </div>
        {onModalButtonClick && (
          <AddButton onClick={onModalButtonClick} />
        )}
      </div>

      <div className="list-group list-group-accordion">
        {children}

        {searchResultsText && (
          <div
            className="list-group-item list-group-subheading search-results-meta text-muted"
          >
            {searchResultsText}
          </div>
        )}
      </div>
    </div>
  );
};

LHS.propTypes = propTypes;

export default LHS;
