/* eslint-disable no-undef */

import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

const sweetAlert = ({
  title = 'Are you sure?',
  text = '',
  type = 'warning',
  showCancelButton = true,
  confirmButtonText = '',
  closeOnConfirm = false,
  ...other
}, cb) => swal({
  title,
  text,
  type,
  showCancelButton,
  confirmButtonText,
  closeOnConfirm,
  ...other,
}, cb);

sweetAlert.error = err => swal({
  title: 'Oops... Something went wrong!',
  text: err.reason || 'Internal server error',
  type: 'error',
  timer: ALERT_AUTOHIDE_TIME,
  showConfirmButton: false,
});

sweetAlert.success = (title, body, {
  showConfirmButton = false,
  showCancelButton = false,
  timer = ALERT_AUTOHIDE_TIME,
  ...other
} = {}) => swal({
  title,
  timer,
  showConfirmButton,
  showCancelButton,
  text: body,
  type: 'success',
  ...other,
});

swal.showPasswordForm = ({
  text = 'Enter your password:',
  showCancelButton = true,
  confirmButtonText = 'Confirm',
  closeOnConfirm = false,
  showLoaderOnConfirm = true,
  ...other
}, ...rest) => swal({
  text,
  showCancelButton,
  confirmButtonText,
  closeOnConfirm,
  showLoaderOnConfirm,
  type: 'input',
  inputType: 'password',
  ...other,
}, ...rest);

export default Object.assign(sweetAlert, swal);
