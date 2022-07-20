const client = require('./config/db.config')
const express = require('express');
const app = express();
const cors = require('cors')

const PORT = 3001;
const ABOUT_API = "API sever for WelBex test is now listening at port 3001";
const API_VERS = "/api/1.0"

const corsRules = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 204
}

app.use(cors(corsRules));

app.listen(PORT, () => {
    console.log(ABOUT_API);
})

app.get('/', (req, res) => {
    res.send(ABOUT_API)
})

app.get(API_VERS + '/count', (req, res) => {
    let query = "";

    if (req.query.column && req.query.cond && req.query.items) {
        switch (req.query.cond) {
            case 'equals':
                if (Number.isInteger(req.query.items)) {
                    query = `SELECT count(*) FROM table1 WHERE ${req.query.column} = ${req.query.items}`;
                } else { query = `SELECT count(*) FROM table1 WHERE ${req.query.column} = '${req.query.items}'`; }
                break;
            case 'contains':
                if (req.query.column !== 'name') {
                    query = `SELECT count(*) FROM table1 WHERE to_char(${req.query.column}, '9999') LIKE ('%${req.query.items}%')`;
                } else { query = `SELECT count(*) FROM table1 WHERE ${req.query.column} LIKE ('%${req.query.items}%')`; }
                break;
            case 'more':
                query = `SELECT count(*) FROM table1 WHERE ${req.query.column} > '${req.query.items}'`;
                break;
            case 'less':
                query = `SELECT count(*) FROM table1 WHERE ${req.query.column} < '${req.query.items}'`;
                break;
            default:
                query = `SELECT count(*) FROM table1`;
        }
    } else {
        query = `SELECT count(*) FROM table1`
    }

    client.query(query, (err, result) => {
        if (!err) { res.json(result.rows); } else { console.log(err) }
    });
    client.end;
});

app.get(API_VERS + '/columns', (req, res) => {
    client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'table1' ORDER BY ordinal_position`, (err, result) => {
        if (!err) { res.json(result.rows); } else { console.log(err) }
    });
    client.end;
});


app.get(API_VERS + '/items', (req, res) => {
    let itemsLimit = 5;
    let itemsOffset = 0;
    let query = "";
    if (req.query.page) { itemsOffset = req.query.page; itemsOffset--; itemsOffset *= req.query.count }
    if (req.query.count) { itemsLimit = req.query.count; }

    if (req.query.column && req.query.cond && req.query.items) {
        switch (req.query.cond) {
            case 'equals':
                if (Number.isInteger(req.query.items)) {
                    query = `SELECT * FROM table1 WHERE ${req.query.column} = ${req.query.items} LIMIT ${itemsLimit} OFFSET ${itemsOffset}`;
                } else { query = `SELECT * FROM table1 WHERE ${req.query.column} = '${req.query.items}' LIMIT ${itemsLimit} OFFSET ${itemsOffset}`; }
                break;
            case 'contains':
                if (req.query.column !== 'name') {
                    query = `SELECT * FROM table1 WHERE to_char(${req.query.column}, '9999') LIKE ('%${req.query.items}%') LIMIT ${itemsLimit} OFFSET ${itemsOffset}`;
                } else { query = `SELECT * FROM table1 WHERE ${req.query.column} LIKE ('%${req.query.items}%') LIMIT ${itemsLimit} OFFSET ${itemsOffset}`; }
                break;
            case 'more':
                query = `SELECT * FROM table1 WHERE ${req.query.column} > '${req.query.items}' LIMIT ${itemsLimit} OFFSET ${itemsOffset}`;
                break;
            case 'less':
                query = `SELECT * FROM table1 WHERE ${req.query.column} < '${req.query.items}' LIMIT ${itemsLimit} OFFSET ${itemsOffset}`;
                break;
            default:
                query = `SELECT * FROM table1 LIMIT ${itemsLimit} OFFSET ${itemsOffset}`;
        }
    } else {
        query = `SELECT * FROM table1 LIMIT ${itemsLimit} OFFSET ${itemsOffset}`;
    }

    client.query(query, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})

client.connect();