const express = require('express');
const cors = require('cors');
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

app.get('/checker', (req, res) => {
    db.all(
        `PRAGMA table_info(city_weather)`,
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
    var airline_budget = req.query.airlineBudget

    var userAirports = req.query.userAirports

    var availability = req.query.availability

    var precipMin = req.query.minPrecip
    var precipMax = req.query.maxPrecip

    var tempMin = req.query.minTemp
    var tempMax = req.query.maxTemp

    var maxCrime = req.query.maxCrime

    db.all(
        `select DISTINCT filtered.cid from ((select a.dst,a.month,a.dst_cid,a.price,a.src 
            from flight_price_history a 
            where(a.src in (${userAirports})) and (a.month in (${availability})) 
            group by a.dst_cid 
            having avg(a.price)<=${airline_budget}) as flight_price_filter inner join
            (select b.cid,b.avg_temp,b.avg_prcp
            from city_weather b
            where (b.avg_prcp<=${precipMax}) and (b.avg_prcp>=${precipMin}) and (b.avg_temp<=${tempMax}) and (b.avg_temp>=${tempMin})) as weather_filter 
            on flight_price_filter.dst_cid = weather_filter.cid
            inner join (select c.cid
            from crime_data c
            where (cast(c.crime_ind as decimal)>=0) and (cast(c.crime_ind as decimal)<=${maxCrime})) as crime_filter
            on weather_filter.cid=crime_filter.cid) filtered`,
        (err, rows) => {
            if (rows.length > 0) {
                res.send(rows);
            } else {

                res.send(null);

                // failed, so return an empty object instead of undefined
            }
        }
    );
});

app.get('/algorithm', (req, res) => {
    var candidateCityIDsArray = req.query.candidateCityIDsArray
    var priceBudgetAir = parseFloat(req.query.priceBudgetAir)
    var minTemp = parseFloat(req.query.minTemp)
    var maxTemp = parseFloat(req.query.maxTemp)
    var minPrecip = parseFloat(req.query.minPrecip)
    var maxPrecip = parseFloat(req.query.maxPrecip)

    // initialize map
    var candidateFeatures = {};
    for (let c of candidateCityIDsArray) {
        candidateFeatures[c] = {
            "cid": c,
        }
    }

    // compute user features
    var userInputFeatures = {
        flight_price: priceBudgetAir, // the lower the better
        temp: (minTemp + maxTemp) / 2.0,
        prcp: (minPrecip + maxPrecip) / 2.0,
        crime: 0, // the lower the better
        activities: 0, // will be assigned as the max of all candidates
        cuisine: 0, // will be assigned as the max of all candidates
    }

    console.log(candidateFeatures)
    console.log(userInputFeatures)
    db.all(
        `PRAGMA table_info(city_weather)`,
        (err, rows) => {
            if (rows.length > 0) {
                
                res.send(userInputFeatures);
            } else {
                res.send({}); // failed, so return an empty object instead of undefined
            }
        }
    );
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/');
});
