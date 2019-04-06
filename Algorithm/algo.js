const sqlite3 = require('sqlite3').verbose();


function ReturnDestinations(
    userAirports, // user input airport
    tripMonths,  // trip months
    tripLength,  // trip length in days
    budget, // user budget
    minTemp, // min temperature
    maxTemp, // max temperature
    minPrecip, // min precipitation
    maxPrecip, // max precipitation
    minCrime, // minimum crime
    maxCrime, // maxCrime
    activities, // list of activities user prefers
    cuisines, // list of  cuisine
    userPriority, // list of user priority in the order [price, temperature, precipitation, crime, activity, cuisine],
                  // user priority is a number between 1-5
    callback, // call back function
) {
    var db = new sqlite3.Database("cityDB.sqlite");

    /*
     TODO: Add filters code here. It should returns a list of candidate city ids
     ...
     */

    /*
     for now I assume following candidateCityIDs
     finally it should be something like:
     let candidateCityIDs = FilterFunction();

     */
    let candidateCityIDs = [
        "g60763", // New York
        "g32655", // Los Angeles
        "g35805", // Chicago
    ];

    // Prepares sql statements for querying 6 different features of the candidate cities
    let monthStrLst = [];
    for (let m of tripMonths) {
        let s = m.toString();
        if (s.length === 1) s = '0' + s;
        monthStrLst.push("'" + s + "'")
    }
    let srcAirportCondition = "'" + userAirports.join("','") + "'";
    let monthCondition = monthStrLst.join(",");

    let cidConditions = "'" + candidateCityIDs.join("', '") + "'";
    let priceBudget = budget * 0.4; // 40% of total budget

    // 1. find average flight price between user airports and destination cities' airports
    // over user input months
    let flightStmt = `select cid, avg(price) as price from 
    (select a.src, a.dst, a.month, a.price as price, b.cid as cid from
    (select src, dst, month, price from flight_price_history where 
    month in (${monthCondition}) and src in (${srcAirportCondition}) and  
     price < ${priceBudget}) as a
    inner join
    (select airport, cid from airport_to_city where cid in (${cidConditions})) as b
    on a.dst = b.airport)
    group by cid`;
    // example output
    // g32655|121.832597222222
    // g35805|357.577777777778
    // g60763|428.475283333333


    // 2. find candidate cities' average temperature over user input months
    let tempStmt = `select cid, avg(avg_temp) as temp from city_weather 
            where cid in (${cidConditions}) and month in (${monthCondition}) group by cid`;
    // example output
    // g32655|66.1083154121864
    // g35805|60.051224636091
    // g60763|62.4112788259958

    //3. find candidate cities' average precipitation over user input months
    let precpStmt = `select cid, avg(avg_prcp) as prcp from city_weather 
            where cid in (${cidConditions}) and month in (${monthCondition}) group by cid`;
    // example output:
    // g32655|0.00533189964157706
    // g35805|31.2406609904177
    // g60763|0.216524341952015

    // 4. find candidate cities' crime index over user input
    let crimeStmt = `select cid, cast(crime_ind as real) as crime_ind from crime_data 
            where cid in (${cidConditions})`;
    // example output
    // g60763|260.66
    // g32655|363.3133333333334
    // g35805|572.3466666666666

    // 5. find candidate cities' matching activity numbers
    let srcActivityCondition = "'" + activities.join("','") + "'";
    let activityStmt = `select city_id as cid, sum(activity_number) as activity_number from city_activities 
            where city_id in (${cidConditions}) and category_activity in (${srcActivityCondition})
            group by city_id`;
    // example output
    // g32655|435
    // g35805|914
    // g60763|991

    // 6. find candidate cities matching cuisine number
    let srcCuisineCondition = "'" + cuisines.join("','") + "'";
    let cuisineStmt = `select city_id as cid, sum(number) as cuisine_number from restaurant_types 
            where city_id in (${cidConditions}) and cuisine in (${srcCuisineCondition})
            group by city_id`;
    // example output
    // g32655|7
    // g35805|84
    // g60763|99


    // initialize map
    var candidateFeatures = {};
    for (let c of candidateCityIDs) {
        candidateFeatures[c] = {}
    }

    // compute user features
    var userInputFeatures = {
        flight_price: budget*0.4, // the lower the better
        temp: (minTemp + maxTemp)/2.0,
        prcp: (minPrecip + maxPrecip)/2.0,
        crime: 0, // the lower the better
        activity_number: 0, // will be assigned as the max of all candidates
        cuisine_number: 0, // will be assigned as the max of all candidates
    }

    // 6 SQL statements
    db.serialize(function () {
        // all 6 features and fill in the feature dictionary
        db.each(flightStmt, function (err, row) {
            if (err) callback(err, null);
            candidateFeatures[row.cid].flight_price = row.price;
            userInputFeatures.flight_price = Math.min(row.price, userInputFeatures.flight_price)
        });

        db.each(tempStmt, function (err, row) {
            if (err) callback(err, null);
            candidateFeatures[row.cid].temp = row.temp;
        });

        db.each(precpStmt, function (err, row) {
            if (err) callback(err, null);
            candidateFeatures[row.cid].prcp = row.prcp;
        });

        db.each(crimeStmt, function (err, row) {
            if (err) callback(err, null);
            candidateFeatures[row.cid].crime = row.crime_ind;
            userInputFeatures.crime = Math.min(row.crime_ind, userInputFeatures.crime)
        });

        db.each(activityStmt, function (err, row) {
            if (err) callback(err, null);
            candidateFeatures[row.cid].activity_number = row.activity_number;
            userInputFeatures.activity_number = Math.max(userInputFeatures.activity_number, row.activity_number)
        });

        db.each(cuisineStmt, function (err, row) {
            if (err) callback(err, null);
            candidateFeatures[row.cid].cuisine_number = row.cuisine_number;
            userInputFeatures.cuisine_number = Math.max(userInputFeatures.cuisine_number, row.cuisine_number)
        }, function(err, rows){
            if (err) callback(err, null);
            console.log("Candidate feature vectors:\n", candidateFeatures);
            console.log("\nuser input feature vectors:\n", userInputFeatures);
        });


    });


    db.close()
}

ReturnDestinations(
    ["SFO", "SJC"], // userAirports
    [4, 5, 6],  // tripMonths
    10,  //tripLength
    3000, // budget
    20, //minTemp
    50, //maxTemp
    0.1, //minPrecip
    1.2, //maxPrecip
    0, //minCrime,
    600, //maxCrime
    ["Nature & Parks", "Concerts & Shows", "Museums"], //list of activities (value must be from category_activity column in city_activity table)
    ['Chinese', 'Italian', 'French'], // list of cuisines (value must be from cuisine column in restaurant_types table)
    [5, 1, 2, 3, 4, 5], // priority in the order of [price, temperature, precipitation, crime, activity, cuisine],
);


// filters
// db.serialize(function() {
//     // price flight filter
//     let priceCandidateTable = 'temp_price_candidate';
//     db.run(`DROP TABLE IF EXISTS ${priceCandidateTable}`);
//     db.run(`CREATE TABLE ${priceCandidateTable} (src text, dst text, month TEXT, price REAL) `);
//     let monthStrLst = []
//     for (let m of tripMonths) {
//         let s = m.toString();
//         if (s.length === 1) s = '0'+s;
//         monthStrLst.push("'" + s + "'")
//     }
//     let monthCondition = monthStrLst.join(",");
//     let srcAirportCondition = "'" + userAirports.join("','") + "'";
//     let priceBudget = budget * 0.4; // 40% of total budget
//     let stmt = `INSERT into ${priceCandidateTable}
//                 select src, dst, month, price from flight_price_history
//                 where month in (${monthCondition}) and
//                 src in (${srcAirportCondition}) and
//                 price < ${priceBudget}`;
//     console.log(stmt);
//     db.run(stmt);
//
//     // filter by temperature and precipitation
//     let weatherCandidateTable = 'temp_weather_candidate';
//     db.run(`DROP TABLE IF EXISTS ${weatherCandidateTable}`);
//     db.run(`CREATE TABLE ${weatherCandidateTable} (cid text, city text, avg_temp REAL, avg_prcp REAL) `);
//
//     stmt = `INSERT INTO ${weatherCandidateTable}
//             select cid, city, avg_temp, avg_prcp from city_weather
//             where (avg_prcp < ${maxPrecip}) and (avg_prcp > ${minPrecip})
//             and (avg_temp < ${maxTemp}) and (avg_temp > ${minTemp})`;
//     console.log(stmt);
//     db.run(stmt)
//
//
//     // filter by crime
//     let crimeCandidateTable = 'temp_crime_candidate';
//     db.run(`DROP TABLE IF EXISTS ${crimeCandidateTable}`);
//     db.run(`CREATE TABLE ${crimeCandidateTable} (cid text, crime_ind ) `);
//
//     stmt = `INSERT INTO ${crimeCandidateTable}
//             select cid, city, avg_temp, avg_prcp from crime_data_number
//             where (avg_prcp < ${maxPrecip}) and (avg_prcp > ${minPrecip})
//             and (avg_temp < ${maxTemp}) and (avg_temp > ${minTemp})`;
//     console.log(stmt);
//     db.run(stmt)
// });