const sqlite3 = require('sqlite3').verbose();



/*
 Compute euclidian distance
 */
function euclideanDistance(v1,v2) {
    let sum = 0;
    for (let i = 0; i < v1.length; i ++) {
        sum += (v1[i]-v2[i])*(v1[i]-v2[i]);
    }
    return Math.sqrt(sum);
}

/*
    compute cosine similarity distance
 */
function cosineSimilarityDistance(v1, v2) {
    let dotProduct = 0;
    let v1VecLength = 0;
    let v2VecLength = 0;

    for (let i = 0; i < v1.length; i ++) {
        dotProduct += v1[i]*v2[i]
        v1VecLength += v1[i]*v1[i]
        v2VecLength += v2[i]*v2[i]
    }
    return 1-dotProduct/Math.sqrt(v1VecLength)/Math.sqrt(v2VecLength);
}

/*
 Compute mean and standard deviation of the vector
 */
function computeMeanStdev(list) {
    let sum = 0;
    for (let v of list) {
        sum += v
    }
    let mean = sum / list.length;

    stdev = 0;
    for (let v of list) {
        stdev += (v-mean)*(v-mean)
    }
    stdev /= list.length;
    stdev = Math.sqrt(stdev);
    return [mean, stdev]
}

function convertToList(obj, keyList) {
    let valList = []
    for (let k of keyList) {
        valList.push(obj[k])
    }
    return valList;
}

/*
 Rank candidate cities
 */
function rankCandidateCities(
    candidateFeatures, // candidate feature map
    userFeature, // user feature map
    userPriority, // user priority mapping
    distanceFunc, // distance function which takes two vectors and compute distance
) {

    // deep copy the features
    var featureMatrix = JSON.parse(JSON.stringify(candidateFeatures))
    featureMatrix["user"] = JSON.parse(JSON.stringify(userFeature))

    featureList = [
        "flight_price",
        "temp",
        "prcp",
        "crime",
        "activities",
        "cuisine"
    ]

    // first normalize each feature to be zero mean and unit variance
    for (let feature of featureList) {
        featureVals = []
        // iterate through each feature vector
        for (let k of Object.keys(featureMatrix)) {
            featureVals.push(featureMatrix[k][feature])
        }

        // compute mean and standard deviation of the feature
        let data = computeMeanStdev(featureVals)
        let mean = data[0]
        let stdev = data[1]

        // normalize by subtract mean and divide standard diviation
        for (let k of Object.keys(featureMatrix)) {
            featureMatrix[k][feature] = (featureMatrix[k][feature]-mean)/stdev * userPriority[feature]
        }
    }

    let userFeatureVector = convertToList(featureMatrix['user'], featureList)
    //console.log("user feature vector:", userFeatureVector)
    // compute distance bewteen user feature and candidate features
    let min_dist = null;
    let max_dist = null;
    let spread = 0;
    for (let cid of Object.keys(candidateFeatures)) {
        let cityFeatureVector = convertToList(featureMatrix[cid], featureList)
        //console.log(cid, "city feature:", cityFeatureVector)

        // compute distance between userFeatureVector and cityFeatureVector
        let distance = distanceFunc(userFeatureVector, cityFeatureVector)
        candidateFeatures[cid]["distance"] = distance;

        if (min_dist === null) {
            min_dist = distance;
            max_dist = distance;
        } else {
            min_dist = Math.min(min_dist, distance);
            max_dist = Math.max(max_dist, distance);
            spread = max_dist-min_dist
        }
    }

    let finalCandidateFeatureList = [];

    for (let cid of Object.keys(candidateFeatures)) {
        candidateFeatures[cid]["matching_score"] = 100 - (candidateFeatures[cid]["distance"]-min_dist)*25/spread
        finalCandidateFeatureList.push(candidateFeatures[cid])
    }

    // sort by matching_score
    finalCandidateFeatureList.sort((a, b) => (a.matching_score < b.matching_score)? 1 : -1)
    return finalCandidateFeatureList
}



/*
    ***Main function***
    Returns a ranked destinations with features and scores
 */
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
    userPriority, // user priority for each features, priority is a number between 0 and 10, example:
                  //{flight_price: 5, temp: 1, prcp: 1, crime: 5, activities: 4, cuisine: 3}

    callback, // call back function
) {
    var db = new sqlite3.Database("../DataCollection/cityDB.sqlite");

    /*
     TODO: Add filters code here. It should returns a list of candidate city ids
     ...

    Deb's sql statement:


    select filtered.cid from

    ((select a.dst,a.month,a.dst_cid,a.price,a.src
    from flight_price_history a
    where(a.src in (userAirports)) and (a.month in (tripMonths))
    group by a.dst_cid
    having avg(a.price)<0.4*budget) as flight_price_filter

    inner join
    (select b.cid,b.avg_temp,b.avg_prcp
    from city_weather b
    where (b.avg_prcp<maxPrecip) and (b.avg_prcp>minPrecip)) as weather_filter
    on flight_price_filter.dst_cid = weather_filter.cid

    inner join (select c.cid, cast(c.crime_ind as real)
    from crime_data c
    where (c.crime_ind>minCrime) and (c.crime_ind<maxCrime)) as crime_filter
    on weather_filter.cid=crime_filter.cid) filtered;
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

    // 7. find city name and latitude and longitude
    let cityStmt = `select cid, city, lat, lng from cities where cid in (${cidConditions})`;

    // initialize map
    var candidateFeatures = {};
    for (let c of candidateCityIDs) {
        candidateFeatures[c] = {
            "cid": c,
        }
    }

    // compute user features
    var userInputFeatures = {
        flight_price: budget*0.4, // the lower the better
        temp: (minTemp + maxTemp)/2.0,
        prcp: (minPrecip + maxPrecip)/2.0,
        crime: 0, // the lower the better
        activities: 0, // will be assigned as the max of all candidates
        cuisine: 0, // will be assigned as the max of all candidates
    }

    // 6 SQL statements
    db.serialize(function () {

        db.each(cityStmt, function(err, row){
            if (err) callback(err, null);
            candidateFeatures[row.cid].city_name = row.city;
            candidateFeatures[row.cid].lat = row.lat;
            candidateFeatures[row.cid].lng = row.lng;
        })

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
            candidateFeatures[row.cid].activities = row.activity_number;
            userInputFeatures.activities = Math.max(userInputFeatures.activities, row.activity_number)
        });

        db.each(cuisineStmt, function (err, row) {
            if (err) callback(err, null);
            candidateFeatures[row.cid].cuisine = row.cuisine_number;
            userInputFeatures.cuisine = Math.max(userInputFeatures.cuisine, row.cuisine_number)
        }, function(err, rows){
            if (err) callback(err, null);

            console.log("Finished generating candidate features and user input feature");
            console.log("Start scoring candidate cities");

            // console.log("Candidate feature vectors:\n", candidateFeatures);
            // console.log("\nuser input feature vectors:\n", userInputFeatures);
            rankedCandidates = rankCandidateCities(
                candidateFeatures,
                userInputFeatures,
                userPriority,
                euclideanDistance, // use euclideandistance, change to "cosineSimilarityDistance" if you want to use cosine similiarity
                )
            callback(null, rankedCandidates)
        });


    });
    db.close()
}


/*
   TEST Run. callback will return ranked candidates

 */
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
    {
        flight_price: 5,
        temp: 1,
        prcp: 1,
        crime: 5,
        activities: 4,
        cuisine: 3
    },  // user priority mapping between feature and priority value (between 0-10)
    function( err, rankedCandidates) {
        if (err) throw err;

        // returned destination ranked by their matching scores
        console.log("Final ranked candidate cities:\n", rankedCandidates)
    }

);


/* Sample output:
[ { cid: 'g60763',
    flight_price: 428.4752833333333,
    temp: 62.411278825995815,
    prcp: 0.2165243419520149,
    crime: 260.66,
    activities: 991,
    cuisine: 99,
    distance: 12.987033839762745,
    matching_score: 100 },
  { cid: 'g32655',
    flight_price: 121.83259722222222,
    temp: 66.1083154121864,
    prcp: 0.005331899641577061,
    crime: 363.3133333333334,
    activities: 435,
    cuisine: 7,
    distance: 15.118837920889625,
    matching_score: 85.61476399817946 },
  { cid: 'g35805',
    flight_price: 357.5777777777778,
    temp: 60.051224636091,
    prcp: 31.24066099041767,
    crime: 572.3466666666666,
    activities: 914,
    cuisine: 84,
    distance: 16.691881088805246,
    matching_score: 75 } ]
 */