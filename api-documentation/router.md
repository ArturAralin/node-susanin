# Роутер
Роутер представляет собой список объектов, каждый из которых описывает поведение одного роута(end point-а)

## Свойства объекта роутера

`method` - `symbol` из `node-susanin/methods` определяющий HTTP метод роута

`path` - путь роута

`controller` - [функция контроллера](), которая будет вызвана в качестве обработчика запроса

`validation` - объект с правилами валидации входных параметров

`middlewaresProps` - объект, свойства которого будут переданы в котроллер

### Пример объекта

```javascript
const {
  GET,
} = require('node-susanin/methods');

module.exports = [
  {
    method: GET,
    path: '/entity',
    controller: ({ reply }) => reply('ok'),
    validation: {},
    middlewaresProps: {
      allowAccess: ['EVERYONE'],
    },
  },
];
```

## Валидация
В `node-susanin` валидация построена на базе библиотеки [Joi](https://github.com/hapijs/joi). Валидацию можно описать для `body`, `query`, `params`.

### Пример

```javascript
const joi = require('joi');

module.exports = [
  {
    ...
    path: '/entity/:id',
    validation: {
      query: {
        limit: joi.number(),
      },
      params: {
        id: joi.number(),
      },
      body: joi.string(), // В этом случае будет ожидаться, что body это просто текст
    },
    ...
  },
];
```
