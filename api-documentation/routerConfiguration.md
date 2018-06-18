# Создание и настройка роутера
Создание и настройка роутера осуществляется функцией `node-susanin.createRouter`.

### Параметры создания роутера
`routesPaths` - список unix масок, по которым будут выбираться файлы с роутами

`pathsRelateTo` - путь, относительно которого будет производиться поиск файлов

`routePrefix` - префикс, который будет добавляться к каждому роуту в роутере. Рекомендуется использовать его в с случае, если в вашем приложении есть несколько роутеров

`extraControllerProps` - список свойств, которые будут добавлены в объект аргументов роутера из объекта `req`

`middlewaresSequence` - порядок выполнения middlewares. [Подробнее](#порядок-выполнения-middlewares)

`defaultValidation` - объект валидации, свойства которого будут добавляться к каждому роуту роутера. Этот объект имеет такую же структуру как и [валидация роута](router.md#Валидация)

`onReply` - функция, которая будет вызвана при вызове в роуте функции `reply`. Рекомендуется использовать эту функцию только для формирования ответа клиенту т.е. эта функция не должна модифицировать данные. Также в этой функции можно вызывать функцию шаблонизатора. Подробнее об [формировании ответа клиенту](#Формирование-ответа-пользователю)

### Пример
```javascript
const express = require('express');
const { createRouter } = require('node-susanin');
const app = express();

app.use(createRouter({
  routesPaths: ['./routes/*.js']
  pathsRelateTo: __dirname,
  routePrefix: 'v1',
  extraControllerProps: ['user'],
  middlewaresSequence: ({
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    ROUTER_MIDDLEWARES,
  }) => [
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    ROUTER_MIDDLEWARES,
  ],
  defaultValidation: {
    query: {
      accessToken: joi.string(),
    },
    body: {},
    params: {},
  },
  onReply: (res, data) => {
    res.status(200).json({ data });
  },
}));

app.listen(8080);
```

# Порядок выполнения middlewares
Порядок выполнения middlewares задается свойством `middlewaresSequence`, которое должно быть функцией, возвращающей список middlewares. 

### Стандартные middlewares:

* PARAMS_VALIDATION - валидация `params`
* QUERY_VALIDATION - валидация `query`
* BODY_VALIDATION - валидация `body`
* ROUTER_MIDDLEWARES - middlewares, которые определены у каждого конкретного роута

Последовательность выполнения по умолчанию `PARAMS_VALIDATION -> QUERY_VALIDATION -> BODY_VALIDATION -> ROUTER_MIDDLEWARES`

### Кастомные middlewares
Помимо установления порядка выполнения middlewares, в `middlewaresSequence` можно добавить кастомные(пользовательские) middlewares, которые будут выполняться для каждого роута.

### Пример
```javascript
const customMiddleware = (req, res, next) => { ... };

createRouter({
  ...
  middlewaresSequence: ({
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    ROUTER_MIDDLEWARES,
  }) => [
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    customMiddleware, // Кастомный middleware
    ROUTER_MIDDLEWARES,
  ],
  ...
});
```

### Формирование ответа пользователю
При вызове `reply` в контроллере, будет вызвана функция `onReply`, в которую будут переданы два аргумента `Express Response Object` и данные, которые были переданы в `reply`.

По умолчанию в `onReply` записана селедующая функция
```javascript
const onReply = (
  res, // Express Response object
  data, // Данные переданные в функцию reply
) => {
  res
    .status(200)
    .json({ data });
};
``` 
