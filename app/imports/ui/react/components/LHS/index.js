import React, { PropTypes } from 'react';
import cx from 'classnames';
import { Card, ListGroup, ListGroupItem } from 'reactstrap';

import ClearField from '../../fields/read/components/ClearField';
import AddButton from '../Buttons/AddButton';
import TextInput from '../../forms/components/TextInput';
import Icon from '../Icons/Icon';

const propTypes = {
  filter: PropTypes.number,
  collapsed: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    type: PropTypes.string,
  })),
  isFocused: PropTypes.bool,
  animating: PropTypes.bool,
  searchText: PropTypes.string,
  searchResultsText: PropTypes.string,
  onClear: PropTypes.func,
  onModalButtonClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  renderAddButton: PropTypes.func,
  children: PropTypes.node,
};

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
  renderAddButton = () => onModalButtonClick && (
    <AddButton onClick={onModalButtonClick}>
      Add
    </AddButton>
  ) || null,
}) => {
  let searchInput;

  const cn = cx(
    'form-group',
    'row',
    'with-loader',
    { loading: animating },
  );

  return (
    <Card>
      <div className="search-form">
        <div className={cn}>
          <ClearField
            {...{ animating, isFocused }}
            onClick={e => onClear && onClear(searchInput)(e)}
          >
            <TextInput
              {...{ onChange, onBlur, onFocus }}
              uncontrolled
              value={searchText}
              disabled={animating}
              getRef={input => (searchInput = input)}
              placeholder="Search..."
            />
          </ClearField>

          {animating && (
            <Icon name="circle-o-notch spin" className="small-loader" />
          )}
        </div>
        {renderAddButton({ animating, isFocused, searchText, searchResultsText })}
      </div>

      <ListGroup className="list-group-accordion">
        {children}

        {searchResultsText && (
          <ListGroupItem className="list-group-subheading search-results-meta text-muted">
            {searchResultsText}
          </ListGroupItem>
        )}
      </ListGroup>
    </Card>
  );
};

LHS.propTypes = propTypes;

export default LHS;
