import React, { PropTypes } from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';

import propTypes from './propTypes';
import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';
import RisksPage from '../Page';
import PreloaderPage from '../../../components/PreloaderPage';
import HeaderMenu from '../HeaderMenu';

const getMenuItems = ({ filters, filter }) => (
  _.map(filters, ({ prepend, name }, key) => {
    const filterWithPrepend = cx(prepend, name);

    return (
      <Dropdown.Item
        pointer
        key={`risk-filter${key}`}
        href={`?filter=${key}`}
        value={filterWithPrepend}
        active={parseInt(key, 10) === parseInt(filter, 10)}
      >
        Risks - {filterWithPrepend}
      </Dropdown.Item>
    );
  })
);

getMenuItems.propTypes = {
  filters: PropTypes.array,
  filter: PropTypes.string,
};

const RisksLayout = (props) => {
  return (
    <div>
      <Header>
        {props.isDiscussionOpened ? (
          <span className="navbar-title">
            {cx(
              props.risk ? `${props.risk.title}` : ''
            )}
          </span>
        ) : (
          <Dropdown
            className="navbar-title"
            activeItemIndex={props.filter - 1}
            onChange={props.onHandleFilterChange}
          >
            <Dropdown.Title className="dropdown-toggle pointer">
              Risks <span className="text-muted">- @value</span>
            </Dropdown.Title>
            <Dropdown.Menu>
              {getMenuItems(props)}
            </Dropdown.Menu>
          </Dropdown>
        )}
        <Header.ArrowBack pull="left" onClick={props.onHandleReturn} />
        <HeaderMenu />
      </Header>
      <div className="content">
        <div className="container-fluid">
          {props.loading ? (
            <PreloaderPage />
          ) : (
            <RisksPage {...props} />
          )}
        </div>
      </div>
    </div>
  );
};

RisksLayout.propTypes = propTypes;

export default RisksLayout;
