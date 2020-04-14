# Simple Poll API

## Deploying & Development

Clone this git repo and install dependencies:

```plain
$ git clone https://github.com/Suyun514/simple-poll-api.git
$ cd simple-poll-api
$ yarn
```

Create a `config.json` file based on `config-example.json`:

```plain
$ cp config-example.json config.json
```

## Database

Create a database and user in PostgreSQL:

```plain
CREATE DATABASE poll;
```

# Run

```plain
$ yarn start
```

## Usage

`GET /api/queryAll`: Query the votes of all the persons.  
`GET /api/queryAllUsers`: Query the vote state of all the users.  
`GET /api/query?id`: Query the number of the votes of the `id`-th person.  
`POST /api/poll?id&uid`: The `uid`-th user voted for the `id`-th person.