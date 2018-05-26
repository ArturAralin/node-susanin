# Контроллер
### Асинхронность
В `node-susanin` предпологается, что контроллеры это [асинхронные функции](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). Исходя из этого, любая асинхронная ошибка которая возникнет в входе выполнения обработчика, вызовет прерывание его выполнения.

```javascript
const asyncFnWithError = async () => {
  throw new Error();
};
const ctrl = async ({ reply }) => {
  await asyncFnWithError();
  // Тут выполнение будет прервано и будет автоматически 
  // сгенерирован ответ с кодом 500

  reply('ok');
};
``` 

### Агументы контроллера

`req` - Express Request объект

`res` - Express Response объект

`headers` - Ссылка на `req.headers`

`body` - Ссылка на `req.body`

`query` - Ссылка на `req.query`

`params` - Ссылка на `req.params`

`next(err)` - Express Next Function

`error(err)` - Функция выозва ошибки.
В отличае от `next` функция `error` создаст ошибку даже если ее вызвать без сообщения ей аргументов.

`reply(data)` - Функция для отправки ответа клиету. [Подробнее](#reply-function)

`errorP` - Функция для работы с асинхронными ошибками. [Подробнее](#errorp-function)

### Пример
```javascript
const ctrl = ({
  req,
  res,
  headers,
  query,
  params,
  body,
  next,
  error,
  errorP,
  reply,
}) => {};
```


## reply function
Функция `reply` предназначена для отправки ответа клиенту. Эта функция принимает только один аргумент который должен соответсовать [типам данных JSON](https://www.w3schools.com/js/js_json_datatypes.asp). Поведение с другими типами данных не определено.

### Формат ответа
Формат ответа задается в [настройках роутера]() совйством `onReply`.

### Promise как аргумент
В функцию `reply` в качестве данных можно передать `PromiseLike` объект, из которого внутри функции будет извлечено значение и отправлено клиенту. В случае возникновения ошибки, `reply` автоматически вызовет функцию `next`.

```javascript
const ctrl = ({ reply }) => {
  const promise = Promise.resolve('ok');

  reply(promise);
}
```

# errorP function
Функция `errorP` позволяет генерировать ошибки, которые будут корректно обрабатываться асинхронными функциями. Эту функцию можно использовать в двух стилях

### Пример использования с вызовом `errorP` в `.catch`
```javascript
const ctrl = async ({
  errorP,
}) => {
  await asyncFnWithError()
    .catch(errorP(errorDetails));
}
```

### Пример использования с предварительным созданием ошибки
```javascript
const { errorP } = require('node-susanin');
const FrequentError = errorP(errorDetails);

const ctrl = ({
  errorP,
}) => {
  const promise = asyncFnWithError();

  FrequentError(promise);
}
```
