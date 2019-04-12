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
        `SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%'`,
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
    var candidateCityIDsString = req.query.candidateCityIDsString
    var closestAirports = req.query.closestAirports
    var priceBudgetAir = parseFloat(req.query.priceBudgetAir)
    var availabilityString = req.query.availabilityString
    var minTemp = parseFloat(req.query.minTemp)
    var maxTemp = parseFloat(req.query.maxTemp)
    var minPrecip = parseFloat(req.query.minPrecip)
    var maxPrecip = parseFloat(req.query.maxPrecip)
    var selectedActivities = req.query.selectedActivities
    var selectedFood = req.query.selectedFood

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

    let callback = function (err, rankedCandidates) {
        if (err) throw (err, rankedCandidates);
        // returned destination ranked by their matching scores

        // console.log("Final ranked candidate cities:\n", rankedCandidates)
    }

    let cityStmt = `select cid, city, lat, lng from cities where cid in (${candidateCityIDsString})`;

    let flightStmt = `select cid, avg(price) as price from 
    (select a.src, a.dst, a.month, a.price as price, b.cid as cid from
    (select src, dst, month, price from flight_price_history where 
    month in (${availabilityString}) and src in (${closestAirports}) and  
     price < ${priceBudgetAir}) as a
    inner join
    (select airport, cid from airport_to_city where cid in (${candidateCityIDsString})) as b
    on a.dst = b.airport)
    group by cid`;

    let tempStmt = `select cid, avg(avg_temp) as temp from city_weather 
            where cid in (${candidateCityIDsString}) and month in (${availabilityString}) group by cid`;

    let precpStmt = `select cid, avg(avg_prcp) as prcp from city_weather 
            where cid in (${candidateCityIDsString}) and month in (${availabilityString}) group by cid`;

    let activityStmt = `select city_id as cid, sum(activity_number) as activity_number from city_activities 
            where city_id in (${candidateCityIDsString}) and category_activity in (${selectedActivities})
            group by city_id`;

    let cuisineStmt = `select city_id as cid, sum(number) as cuisine_number from restaurant_types 
            where city_id in (${candidateCityIDsString}) and cuisine in (${selectedFood})
            group by city_id`;

    let crimeStmt = `select cid, cast(crime_ind as decimal) as crime_ind from crime_data 
            where cid in (${candidateCityIDsString})`;

    // console.log(selectedFood)
    // console.log(selectedActivities)
    db.serialize(() => {
        db.each(cityStmt, function (err, row) {
            if (err) callback('city', null);
            candidateFeatures[row.cid].city_name = row.city;
            candidateFeatures[row.cid].lat = row.lat;
            candidateFeatures[row.cid].lng = row.lng;
        });

        db.each(flightStmt, function (err, row) {
            if (err) callback(err, null);
            candidateFeatures[row.cid].flight_price = row.price;
            userInputFeatures.flight_price = Math.min(row.price, userInputFeatures.flight_price)
        });

        db.each(tempStmt, function (err, row) {
            if (err) callback('temp', null);
            candidateFeatures[row.cid].temp = row.temp;
        });

        db.each(precpStmt, function (err, row) {
            if (err) callback(err, null);
            candidateFeatures[row.cid].prcp = row.prcp;
        });

        db.each(activityStmt, function (err, row) {
            if (err) callback('activ', null);
            candidateFeatures[row.cid].activities = row.activity_number;
            userInputFeatures.activities = Math.max(userInputFeatures.activities, row.activity_number)
        });


        db.each(cuisineStmt, function (err, row) {
            if (err) callback('cuisine', null);
            candidateFeatures[row.cid].cuisine = row.cuisine_number;
            userInputFeatures.cuisine = Math.max(userInputFeatures.cuisine, row.cuisine_number)
        });


        db.each(crimeStmt, function (err, row) {
            if (err) callback('crime', null);
            candidateFeatures[row.cid].crime = row.crime_ind;
            userInputFeatures.crime = Math.min(row.crime_ind, userInputFeatures.crime)
        }, () => {
            res.send(
                {
                    candidateFeatures: candidateFeatures,
                    userInputFeatures: userInputFeatures
                }
            );
        });

    })
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/');
});
