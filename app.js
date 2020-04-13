const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const config = require('./config.json');
const database = require('./database');

let app = new Koa();
let router = new Router();

app.use(bodyParser());
app.use(router.middleware());

database.init();

fs.readdirSync(path.join(__dirname, 'modules'))
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => require(path.join(__dirname, 'modules', file)));

router.get('/api/queryAll', async (ctx) => {
    ctx.body = database.getPersons();
});

app.listen(process.argv[2] ? process.argv[2] : 80);