import { FlowRouter } from 'meteor/kadira:flow-router';
import { Autolinker } from 'meteor/konecty:autolinker';
import Blaze from 'meteor/gadicc:blaze-react-component';

import modal from '/imports/startup/client/mixins/modal';
import { invokeC, getFormattedDate, handleMethodResult } from '/imports/api/helpers';
import { TruncatedStringLengths } from '/imports/api/constants';
import { remove as removeMessage } from '/imports/api/messages/methods';
import { Files } from '/imports/api/files/files';

export const invokeUser = path => obj => invokeC(path, obj.user);

export const isAuthor = props => Object.is(Meteor.userId(), props.createdBy);

export const getFile = props => Files.findOne({ _id: props.fileId });

// Prop creators

export const getMessagePath = (props) => {
  const currentRouteName = FlowRouter.getRouteName();
  const params = FlowRouter.current().params;
  const queryParams = { at: props._id };

  return FlowRouter.path(currentRouteName, params, queryParams);
}

export const getUserAvatar = invokeUser('avatar');

export const getUserFullNameOrEmail = invokeUser('fullNameOrEmail');

export const getUserFirstName = invokeUser('firstName');

export const getMessageTime = props => getFormattedDate(props.createdAt, 'h:mm A');

export const getMessageContents = ({ type = 'text', text = '', file = {} } = {}) => {
  switch(type) {
    case 'text':
      return Autolinker.link(text, {
        truncate: TruncatedStringLengths.c40
      });
      break;
    case 'file':
      return <Blaze template='FileItem_Read' {...getFile(props)}/>
      break;
    default:
      return text;
      break;
  }
}

export const getPathToMessage = (props) => {
  const currentRouteName = FlowRouter.getRouteName();
  const params = FlowRouter.current().params;
  const queryParams = { at: props._id };

  return FlowRouter.path(currentRouteName, params, queryParams);
}

export const getPathToMessageToCopy = (props) => {
  const path = getPathToMessage(props);
  const url = `${location.protocol}//${location.hostname}:${location.port}`;

  return `${url}${path}`;
};

// Handlers

export const openUserDetails = (props) => {
  return (e) => {
    e.preventDefault();

    modal.modal.open({
      template: 'UserDirectory_Card_Read_Inner',
      _title: 'User details',
      user: props.user
    });
  };
}

export const deselect = (props) => {
  return (e) => {
    const at = FlowRouter.getQueryParam('at');

    if (Object.is(at, props._id)) {
      FlowRouter.setQueryParams({ at: null });
    }
  };
}

export const remove = (props) => {
  return (e) => {
    if (!isAuthor(props)) return;

    swal({
      title: 'Are you sure you want to delete this message?',
      text: 'This cannot be undone.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: true
    },
    () => removeMessage.call({ _id: props._id }, handleMethodResult));
  };
};
