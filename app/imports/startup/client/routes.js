import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { withOptions } from 'react-mounter';
import { mounter } from 'react-mounter/dist/client';
import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import ReactDOM from 'react-dom';
import React from 'react';
import { $ } from 'meteor/jquery';
import '/imports/ui/components';
import '/imports/ui/layouts';
import '/imports/ui/pages';

import { DocumentTypes } from '/imports/share/constants';
import StandardsProvider from '/imports/ui/react/standards/components/Provider';
import RisksProvider from '/imports/ui/react/risks/components/Provider';
import CustomersProvider from '/imports/ui/react/customers/components/Provider';
import HelpDocsProvider from '/imports/ui/react/help-docs/components/HelpDocsProvider';
import TransitionalLayout from '/imports/ui/react/layouts/TransitionalLayout';
import UnsubscribeFromNotifications
  from '/imports/ui/react/pages/components/Unsubscribe/Notifications';
import UnsubscribeFromDailyRecap from '/imports/ui/react/pages/components/Unsubscribe/DailyRecap';
import UnsubscribeFromDiscussion from '/imports/ui/react/pages/components/Unsubscribe/Discussion';

BlazeLayout.setRoot('#app');

function redirectHandler() {
  const targetURL = FlowRouter.getQueryParam('b');
  if (targetURL) {
    FlowRouter.go(targetURL);
  } else {
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('hello');
    });
  }
}

function checkLoggedIn(context, redirect) {
  // Redirect to maintenance route can be here.
  // redirect('maintenance'); return;
  if (!Meteor.loggingIn()) {
    if (!Meteor.user()) {
      redirect('signIn', {}, { b: context.path });
    }
  }
}

function checkEmailVerified(context, redirect) {
  const user = Meteor.user();
  const isOnUserWaiting = context.route.name === 'userWaiting';

  if (user) {
    const email = user.emails[0];

    if (!email.verified) {
      if (!isOnUserWaiting) {
        redirect('userWaiting');
      }
    } else {
      if (isOnUserWaiting) {
        redirect('hello');
      }
    }
  }
}

function mount(layoutClass, regions, options = {}) {
  const additionalOptions = {
    rootId: regions && regions.rootId || options.rootId || 'react-root',
    rootProps: options.rootProps || {},
  };

  mounter(layoutClass, regions, { ...options, ...additionalOptions });
}

const mount2 = withOptions({
  rootId: 'app',
}, mount);

const ROUTE_MAP = {
  STANDARDS: 'standards',
  NON_CONFORMITIES: 'non-conformities',
  RISKS: 'risks',
  ACTIONS: 'actions',
};

const DOCUMENT_TYPE_BY_ROUTE_MAP = {
  [ROUTE_MAP.STANDARDS]: DocumentTypes.STANDARD,
  [ROUTE_MAP.NON_CONFORMITIES]: DocumentTypes.NON_CONFORMITY,
  [ROUTE_MAP.RISKS]: DocumentTypes.RISK,
  [ROUTE_MAP.ACTIONS]: DocumentTypes.CORRECTIVE_ACTION,
};

AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signIn',
  path: '/login',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content',
  redirect: redirectHandler,
});

AccountsTemplates.configureRoute('signUp', {
  layoutType: 'blaze',
  name: 'signUp',
  path: '/sign-up',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content',
  redirect: redirectHandler,
});

AccountsTemplates.configureRoute('verifyEmail', {
  layoutType: 'blaze',
  name: 'verifyEmail',
  path: '/verify-email',
  layoutTemplate: 'TransitionalLayout',
  template: 'VerifyEmailPage',
  contentRegion: 'content',
  redirect() {
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('hello');
    });
    toastr.success('Email verified! Thanks!');
  },
});

AccountsTemplates.configureRoute('forgotPwd', {
  layoutType: 'blaze',
  name: 'forgotPwd',
  path: '/forgot-password',
  layoutTemplate: 'LoginLayout',
  redirect: redirectHandler,
  layoutRegions: {},
  contentRegion: 'content',
});

AccountsTemplates.configureRoute('resetPwd', {
  layoutType: 'blaze',
  name: 'resetPwd',
  path: '/reset-password',
  layoutTemplate: 'LoginLayout',
  redirect: redirectHandler,
  layoutRegions: {},
  contentRegion: 'content',
});

FlowRouter.route('/accept-invitation/:invitationId', {
  name: 'acceptInvitationPage',
  action() {
    BlazeLayout.render('LoginLayout', {
      content: 'AcceptInvitationPage',
    });
  },
});

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('LoginLayout');
  },
});

FlowRouter.route('/hello', {
  name: 'hello',
  action() {
    BlazeLayout.render('TransitionalLayout', {
      content: 'HelloPage',
    });
  },
});

// Uncomment this code to enable maintenance page
// FlowRouter.route('/maintenance', {
//   name: 'maintenance',
//   action(params) {
//     BlazeLayout.render('TransitionalLayout', {
//       content: 'MaintenancePage'
//     });
//   }
// });

FlowRouter.route('/sign-out', {
  name: 'signOut',
  action() {
    Meteor.logout();
    const targetURL = FlowRouter.getQueryParam('b');
    if (targetURL) {
      FlowRouter.go(targetURL);
    } else {
      FlowRouter.withReplaceState(() => {
        FlowRouter.go('hello');
      });
    }
  },
});

FlowRouter.route('/user-waiting', {
  name: 'userWaiting',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.render('TransitionalLayout', {
      content: 'UserAccountWaitingPage',
    });
  },
});

FlowRouter.route('/transfer-organization/:transferId', {
  name: 'transferOrganization',
  triggersEnter: [checkLoggedIn],
  action() {
    BlazeLayout.render('TransitionalLayout', {
      content: 'TransferOrganizationPage',
    });
  },
});

FlowRouter.route('/customers', {
  name: 'customers',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    mount2(CustomersProvider);
  },
});

FlowRouter.route('/customers/:urlItemId', {
  name: 'customer',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    mount2(CustomersProvider);
  },
});

FlowRouter.route('/help-center', {
  name: 'helpDocs',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    mount2(HelpDocsProvider);
  },
});

FlowRouter.route('/help-center/:helpId', {
  name: 'helpDoc',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    mount2(HelpDocsProvider);
  },
});

FlowRouter.route('/:orgSerialNumber/standards', {
  name: 'standards',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    mount2(StandardsProvider);
  },
});

FlowRouter.route('/:orgSerialNumber/standards/:urlItemId', {
  name: 'standard',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    mount2(StandardsProvider);
  },
});

FlowRouter.route('/:orgSerialNumber/standards/:urlItemId/discussion', {
  // http://localhost:3000/98/standards/Zty4NCagWvrcuLYoy/discussion
  name: 'standardDiscussion',
  triggersEnter: [checkLoggedIn, checkEmailVerified, BlazeLayout.reset],
  action() {
    mount2(StandardsProvider, { isDiscussionOpened: true });
  },
});

FlowRouter.route('/:orgSerialNumber/risks', {
  name: 'risks',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    mount2(RisksProvider);
  },
});

FlowRouter.route('/:orgSerialNumber/risks/:urlItemId', {
  name: 'risk',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    mount2(RisksProvider);
  },
});

FlowRouter.route('/:orgSerialNumber/risks/:urlItemId/discussion', {
  // http://localhost:3000/98/standards/Zty4NCagWvrcuLYoy/discussion
  name: 'riskDiscussion',
  triggersEnter: [checkLoggedIn, checkEmailVerified, BlazeLayout.reset],
  action() {
    mount2(RisksProvider, { isDiscussionOpened: true });
  },
});

FlowRouter.route('/:orgSerialNumber/non-conformities/:urlItemId/discussion', {
  // http://localhost:3000/98/non-conformities/Zty4NCagWvrcuLYoy/discussion
  name: 'nonConformityDiscussion',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.render('NC_Layout', {
      content: 'NC_Page',
      isDiscussionOpened: true,
    });
  },
});

FlowRouter.route('/:orgSerialNumber', {
  name: 'dashboardPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.reset();

    $(() => ReactDOM.unmountComponentAtNode(document.getElementById('app')));

    BlazeLayout.render('Dashboard_Layout', {
      content: 'Dashboard_Page',
    });
  },
});

FlowRouter.route('/:orgSerialNumber/users', {
  name: 'userDirectoryPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.render('UserDirectory_Layout', {
      content: 'UserDirectory_Page',
    });
  },
});

FlowRouter.route('/:orgSerialNumber/users/:userId', {
  name: 'userDirectoryUserPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.render('UserDirectory_Layout', {
      content: 'UserDirectory_Page',
    });
  },
});

FlowRouter.route('/:orgSerialNumber/non-conformities', {
  name: 'nonconformities',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.render('NC_Layout', {
      content: 'NC_Page',
    });
  },
});

FlowRouter.route('/:orgSerialNumber/non-conformities/:urlItemId', {
  name: 'nonconformity',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.render('NC_Layout', {
      content: 'NC_Page',
    });
  },
});

FlowRouter.route('/:orgSerialNumber/work-inbox', {
  name: 'workInbox',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.render('WorkInbox_Layout', {
      content: 'WorkInbox_Page',
    });
  },
});

FlowRouter.route('/:orgSerialNumber/work-inbox/:workItemId', {
  name: 'workInboxItem',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.render('WorkInbox_Layout', {
      content: 'WorkInbox_Page',
    });
  },
});

FlowRouter.route('/:orgSerialNumber/:route/:documentId/unsubscribe', {
  name: 'unsubscribeFromNotifications',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action({ documentId, route, orgSerialNumber }) {
    const documentType = DOCUMENT_TYPE_BY_ROUTE_MAP[route];

    mount2(TransitionalLayout, {
      content: (
        <UnsubscribeFromNotifications {...{ documentId, documentType, orgSerialNumber }} />
      ),
    });
  },
});

FlowRouter.route('/:orgSerialNumber/unsubscribe', {
  name: 'unsubscribeFromDailyRecap',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action({ orgSerialNumber }) {
    mount2(TransitionalLayout, {
      content: (
        <UnsubscribeFromDailyRecap {...{ orgSerialNumber }} />
      ),
    });
  },
});

FlowRouter.route('/:orgSerialNumber/:route/:documentId/discussion/unsubscribe', {
  name: 'unsubscribeFromDiscussionNotifications',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action({ documentId, route, orgSerialNumber }) {
    const documentType = DOCUMENT_TYPE_BY_ROUTE_MAP[route];

    mount2(TransitionalLayout, {
      content: (
        <UnsubscribeFromDiscussion
          {...{ documentId, documentType, orgSerialNumber }}
        />
      ),
    });
  },
});
