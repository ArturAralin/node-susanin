const express = require('express');
const { createRouter } = require('../../index');
const path = require('path');

const app = express();

const routerV1 = createRouter({
  routePrefix: 'v1',
  routesPath: path.resolve(__dirname, './routes/v1'),
});

const routerV2 = createRouter({
  routePrefix: 'v2',
  routesPath: path.resolve(__dirname, './routes/v2'),
});

app.use('/api', routerV1);
app.use('/api', routerV2);
app.listen(8080, () => {
  console.log('Started on 8080');
});
