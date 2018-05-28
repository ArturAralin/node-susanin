# Middleware
В `node-susanin` middlewares можно записывать в двух разных стилях.

### Классический стиль middleware
```javascript
const middleware = (req, res, next) => {
  next();
};
```

### Стиль с одним аргументом
```javascript
const middleware = ({
  req,
  res,
  next,
  headers,
  error,
  pass,
  props,
  setToReq,
  params,
  body,
  query,
}) => {
  pass();
};
```

### Описание свойств

`req` - Express Request объект

`res` - Express Response объект

`headers` - Ссылка на `req.headers`

`body` - Ссылка на `req.body`

`query` - Ссылка на `req.query`

`params` - Ссылка на `req.params`

`props` - Свойства, объявленные в `middlewaresProps`

`next(err)` - Express Next Function

`error(err)` - Функция выозва ошибки.
В отличие от `next` функция `error` создаст ошибку даже если ее вызвать без сообщения ей аргументов.

`pass` - Функция, вызов которой перейдет к выполнению следующего middleware или контроллера

`setToReq(key, value)` - Функция для безопасного присвоения свойств к объекту `req` 
