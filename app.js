const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');

const config = require('./config.json');
const database = require('./database');

let app = new Koa();
let router = new Router();

app.use(static('.'));
app.use(bodyParser());
app.use(router.middleware());

database.init(config.persons, config.users);

router.get('/api/queryAll', async (ctx) => {
    ctx.body = await database.getPersons();
});

router.get('/api/queryAllUsers', async (ctx) => {
    ctx.body = await database.getUsers();
});

router.get('/api/query', async (ctx) => {
    ctx.body = (await database.getPerson(ctx.request.query.id));
});

router.post('/api/poll', async (ctx) => {
    let { id, uid } = ctx.request.body;

    let user = await database.getUser(uid);

    if (user.count.length >= config.maxPoll) {
        ctx.body = { error: true, msg: `您已经投了 ${user.count.length} 票了，不能再投了！` };
        return;
    }

    if (user.count.indexOf(parseInt(id)) != -1) {
        ctx.body = { error: true, msg: "您已经为这个人投过票了！" };
        return;
    }

    let person = await database.getPerson(id);
    await database.updateParson(id, parseInt(person.count) + 1);
    await database.updateUser(uid, id);

    ctx.body = { error: false, msg: "投票成功！" };
});

app.listen(process.argv[2] ? process.argv[2] : 80);