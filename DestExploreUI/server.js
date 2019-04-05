const express = require('express');
const cors = require('cors')
const app = express();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database/cityDB.sqlite');

app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello this is the database you're looking for!");
});

app.get('/airports', (req, res) => {
    db.all(
        `SELECT iata_code, latitude, longitude FROM airport_info WHERE country = 'United States'`,
        // callback function to run when the query finishes:
        (err, rows) => {
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({}); // failed, so return an empty object instead of undefined
            }
        }
    );
});

app.get('/airPriceFilter', (req, res) => {
    db.all(
        `SELECT * FROM flight_price_history LIMIT 5`,
        (err, rows) => {
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({}); // failed, so return an empty object instead of undefined
            }
        }
    );
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/');
});
