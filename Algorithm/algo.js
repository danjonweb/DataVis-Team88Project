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
    cuisine, // list of  cuisine
) {
    var db = new sqlite3.Database("cityDB.sqlite");

    db.serialize(function() {
        // price flight price
        let monthStrLst = []
        for (let m of tripMonths) {
            let s = m.toString();
            if (s.length === 1) s = '0'+s;
            monthStrLst.push("'" + s + "'")
        }
        let monthCondition = monthStrLst.join(",");
        let srcAirportCondition = "'" + userAirports.join("','") + "'";
        let priceBudget = budget * 0.4; // 40% of total budget
        let stmt = `select * from flight_price_history 
                    where month in (${monthCondition}) and
                    src in (${srcAirportCondition}) and
                    price < ${priceBudget}`;
        console.log(stmt);
        db.each(stmt, function(err, row){
            console.log(row.src, row.dst, row.month, row.price)
        }, function(err, rows) {
            console.log("Found total", rows, "candidates");
        });

    });

    db.close();

}

ReturnDestinations(
    ["SFO", "SJC"], // userAirports
    [4,5,6],  // tripMonths
    10,  //tripLength
    3000, // budget
);