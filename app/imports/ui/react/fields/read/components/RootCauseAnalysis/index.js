import React, { PropTypes } from 'react';

import createReadFields from '/imports/ui/react/helpers';
import FileProvider from '/imports/ui/react/containers/providers/FileProvider';

// TODO: needs testing

const RootCauseAnalysis = ({ causes, fileIds }) => {
  const data = causes.map(({ text, index }) => ({
    text,
    label: `Cause ${index}`,
  }));

  const fields = createReadFields(data);

  return (
    <div>
      {fields}
      {!!fileIds.length && fileIds.map((fileId) => (
        <FileProvider key={fileId} {...{ fileId }} />
      ))}
    </div>
  );
};

RootCauseAnalysis.propTypes = {
  causes: PropTypes.arrayOf(Object),
  fileIds: PropTypes.arrayOf(PropTypes.string),
};

export default RootCauseAnalysis;
