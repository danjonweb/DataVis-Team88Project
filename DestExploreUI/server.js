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

app.get('/activity', (req, res) => {
    db.all(
        `SELECT DISTINCT category_activity, activity_name FROM city_activities ORDER BY 1`,
        (err, rows) => {
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({}); // failed, so return an empty object instead of undefined
            }
        }
    );
});

app.get('/cuisine', (req, res) => {
    db.all(
        `SELECT DISTINCT cuisine FROM restaurant_types ORDER BY 1`,
        (err, rows) => {
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({}); // failed, so return an empty object instead of undefined
            }
        }
    );
});

app.get('/filteredcandidates', (req, res) => {
    db.all(
        `select filtered.cid from ((select a.dst,a.month,a.dst_cid,a.price,a.src 
            from flight_price_history a 
            where(a.src in ("NYC","EWR")) and (a.month in ("02")) 
            group by a.dst_cid 
            having avg(a.price)<200) as flight_price_filter inner join
            (select b.cid,b.avg_temp,b.avg_prcp
            from city_weather b
            where (b.avg_prcp<2) and (b.avg_prcp>1)) as weather_filter 
            on flight_price_filter.dst_cid = weather_filter.cid
            inner join (select c.cid, cast(c.crime_ind as real)
            from crime_data c
            where (c.crime_ind>100) and (c.crime_ind<200)) as crime_filter
            on weather_filter.cid=crime_filter.cid) filtered`,
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
