import React from 'react';

import Field from '../fields/read/components/Field';
import { flattenObjects, compose, join, mapC, concatC, split } from '/imports/api/helpers';
import { lowercase, capitalize } from '/imports/share/helpers';

const createKey = (label) => {
  const words = split(' ', label);
  const first = words[0];
  const rest = mapC(capitalize, words.slice(1));
  const result = compose(
    join(''),
    concatC([rest]),
    lowercase,
  )(first);
  return result;
};

const mapFields = fields => fields.map(({ label, text, render, ...other }) => {
  const key = createKey(label);
  const field = <Field {...{ key, label, ...other }}>{text}</Field>;
  return !!text && ({
    [key]: render ? render(field) : field,
  });
});

export default fields => flattenObjects(mapFields(fields));
