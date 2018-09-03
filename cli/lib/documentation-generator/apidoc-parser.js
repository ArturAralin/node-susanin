const fs = require('fs');
const {
  match,
  test,
  pipe,
  map,
  split,
  filter,
  trim,
  find,
  applySpec,
  replace,
  drop,
  adjust,
  head,
  apply,
  concat,
  when,
  complement,
  isNil,
  toLower,
} = require('ramda');

const dropFirst = drop(1);
const isNotNil = complement(isNil);
const createValueGeter = tag =>
  pipe(
    find(test(new RegExp(`@${tag}.*`, 'g'))),
    when(
      isNotNil,
      replace(new RegExp(`@${tag} `, 'g'), ''),
    ),
  );

const id = pipe(
  find(test(/@api.*{.*}/)),
  replace(/\s+/g, ' '),
  split(' '),
  dropFirst,
  adjust(
    pipe(
      match(/\w+/g),
      head,
    ),
    0,
  ),
  apply(concat),
  toLower,
);

const matchJsDocs = match(/\/\*\*\s*\n([^*]|(\*(?!\/)))*\*\//g);
const parseJsDocs = pipe(
  matchJsDocs,
  filter(test(/@api.*{.*}/g)),
  map(pipe(
    split('\n'),
    filter(test(/@api/)),
    map(pipe(
      trim,
      drop(1),
      trim,
    )),
    applySpec({
      id,
      name: createValueGeter('apiName'),
      group: createValueGeter('apiGroup'),
      version: createValueGeter('apiVersion'),
      description: createValueGeter('apiDescription'),
    }),
    filter(Boolean),
  )),
);

module.exports = (absoluteFilePath) => {
  const text = fs.readFileSync(absoluteFilePath).toString();

  return parseJsDocs(text);
};
