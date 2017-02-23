import React, { PropTypes } from 'react';
import { ListGroupItemText } from 'reactstrap';
import cx from 'classnames';

const Table = ({ header, borderless, big, className, children, ...other }) => (
  <table className={cx('table', { borderless, big }, className)} {...other}>
    <thead>
      <tr>
        {header.map((head, index) => (
          <ListGroupItemText tag="th" key={`th-${index}`}>
            {head}
          </ListGroupItemText>
        ))}
      </tr>
    </thead>
    <tbody>
      {children.map((value, index) => (
        <tr key={`tr-${index}`}>
          {value.map((cell, cellIndex) => (
            <td key={`td-${cellIndex}`}>
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

Table.propTypes = {
  borderless: PropTypes.bool,
  big: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

export default Table;
