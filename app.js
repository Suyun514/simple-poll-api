const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');

const config = require('./config.json');
const database = require('./database');

let app = new Koa();
let router = new Router();

app.use(cors());
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
    let id = ctx.request.query.id;
    
    if (id >= 1 && id <= config.persons) {
        ctx.body = (await database.getPerson(ctx.request.query.id));
    } else {
        ctx.body = "编号超出范围！";
    }
});

router.post('/api/poll', async (ctx) => {
    let { id, uid } = ctx.request.body;

    let user = await database.getUser(uid);

    if (!(uid >= 1 && uid <= config.users)) {
        ctx.body = { error: true, msg: "学号超出范围！" };
        return;
    }

    if (user.count.length >= config.maxPoll) {
        ctx.body = { error: true, msg: `您已经投了 ${user.count.length} 票了，不能再投了！` };
        return;
    }

    if (user.count.indexOf(parseInt(id)) != -1) {
        ctx.body = { error: true, msg: "您已经为这个人投过票了！" };
        return;
    }

    let person = await database.getPerson(id);
    
    if (!(id >= 1 && id <= config.persons)) {
        ctx.body = { error: true, msg: "编号超出范围！" };
        return;
    }
    
    await database.updateParson(id, parseInt(person.count) + 1);
    await database.updateUser(uid, id);

    ctx.body = { error: false, msg: "投票成功！" };
});

app.listen(process.argv[2] ? process.argv[2] : 80);