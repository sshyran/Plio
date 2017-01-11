import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { connect } from 'react-redux';
import { compose, withProps, withState, withHandlers } from 'recompose';
import { composeWithTracker } from 'react-komposer';

import store from '/imports/client/store';
import { callMethod } from '/imports/client/store/actions/modalActions';
import { pickDeep } from '/imports/api/helpers';

import DataExport from '../../components/DataExport';
import initMainData from '../../loaders/initMainData';


const enhance = compose(
  withProps(() => ({ store })),
  withState('processing', 'setProcessing', false),
  composeWithTracker(initMainData),
  connect(pickDeep(['organizations.organization'])),
  withHandlers({
    onSubmit: ({
      organization,
      setProcessing,
      docType,
    }) => data => {
      setProcessing(true);
      const selectedFields = Object
        .keys(data.fields)
        .filter(key => Boolean(data.fields[key]));

      const selectedFilters = Object
        .keys(data.filter)
        .filter(key => Boolean(data.filter[key]))
        .map(Number);

      callMethod('DataExport.generateLink', {
        docType,
        org: _.pick(organization, '_id', 'name'),
        fields: selectedFields,
        filters: selectedFilters,
      })(store.dispatch)
        .then(({ fileName, token, ...rest }) => {
          console.log({ fileName, token, ...rest });
          setProcessing(false);
          window.location = Meteor.absoluteUrl(`export/${fileName}?token=${token}`);
        })
        .catch((error) => {
          console.log(error);
          setProcessing(false);
        });
    },
  }),
);

export default enhance(DataExport);
