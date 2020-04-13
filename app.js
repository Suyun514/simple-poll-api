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

router.get('/', async (ctx) => {
    ctx.body = 'Hello, world!';
});

app.listen(process.argv[2] ? process.argv[2] : 80);