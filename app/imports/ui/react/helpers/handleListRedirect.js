import curry from 'lodash.curry';

import { getId } from '/imports/api/helpers';

const handleListRedirect = curry((goToDoc, goToDocs, selected, defaultDoc) => {
  if (!selected) {
    if (defaultDoc) goToDoc({ urlItemId: getId(defaultDoc) });
    else goToDocs();
  }
});

export default handleListRedirect;
