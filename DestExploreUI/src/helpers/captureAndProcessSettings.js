


export function captureAndProcess(
    candidateCities,
    closestAirports,
    budget,
    dailySpend,
    airlineDisable,
    availability,
    tripDuration,
    weatherControlOn,
    userTempRange,
    userPrecipRange,
    crimeRating,
    selectedActivities,
    activityOptions,
    selectedFood,
    culinaryOptions
) {
    var airportQstring;
    var availabilityQstring;
    var temperatureRange;
    var precipitationRange;
    var srcCuisineCondition
    var srcActivityCondition
    var airlineBudget

    // Get budget ready
    if (airlineDisable) {
        airlineBudget = budget
    } else {
        airlineBudget = budget - tripDuration * dailySpend
    }


    // Get airport query ready
    var airportList = [];
    closestAirports.forEach(airport => {
        airportList.push(airport.code);
    });
    airportQstring = "'" + airportList.join("','") + "'";

    // Process availability if it exists
    if (availability.startDate === null) {
        // if it doesn't exist it will be all months
        availabilityQstring =
            [" '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' "];

    } else {
        // get the month and the year to do some evaluations 
        let startMonth = availability.startDate.split("/")[1];
        let endMonth = availability.endDate.split("/")[1];

        let startYear = availability.startDate.split("/")[0];
        let endYear = availability.endDate.split("/")[0];

        if ((parseInt(endYear) > parseInt(startYear)) && (parseInt(endMonth) >= parseInt(startMonth))) {
            // if wrap around to the same month or later in a following the following year
            availabilityQstring =
                [" '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' "];

        } else if (startMonth === endMonth) {
            // if your all in the same month in a single year
            availabilityQstring = [`'${startMonth}'`];

        } else if (endMonth < startMonth) {
            // if your wrap around to an earlier month next year
            let dateArray = []
            let i = parseInt(startMonth)
            for (i; i < 13; i++) {
                dateArray.push(i)
            }
            let j = 1
            for (j; j < parseInt(endMonth) + 1; j++) {
                dateArray.push(j)
            }
            let monthStrLst = [];
            for (let m of dateArray) {
                let s = m.toString();
                if (s.length === 1) s = "0" + s;
                monthStrLst.push("'" + s + "'");
            }
            availabilityQstring = monthStrLst;

        } else {
            // if spans multiple months in the same year
            let dateArray = Array.apply(
                0,
                Array(parseInt(endMonth) - parseInt(startMonth) + 1)
            ).map((element, index) => index + parseInt(startMonth));
            let monthStrLst = [];
            for (let m of dateArray) {
                let s = m.toString();
                if (s.length === 1) s = "0" + s;
                monthStrLst.push("'" + s + "'");
            }
            availabilityQstring = monthStrLst;
        }
    }

    // process weather if enabled or set to default
    if (!weatherControlOn) {
        temperatureRange = [-5, 100];
        precipitationRange = [0, 50];
    } else {
        temperatureRange = [userTempRange.low, userTempRange.high];
        precipitationRange = [userPrecipRange.low, userPrecipRange.high];
    }

    // process city ids
    let candidateCityQString = "'" + candidateCities.join("', '") + "'";

    // process activities list
    if (selectedActivities.length < 1) {
        srcActivityCondition = "'" + Object.keys(activityOptions).join("','") + "'";
    } else {
        srcActivityCondition = "'" + selectedActivities.join("','") + "'";
    }

    // process food list
    if (selectedFood.length < 1) {
        srcCuisineCondition = "'" + culinaryOptions.join("','") + "'";
    } else {
        srcCuisineCondition = "'" + selectedFood.join("','") + "'";
    }


    return {
        candidateCitiesString: candidateCityQString,
        candidateCities: candidateCities,
        closestAirports: airportQstring,
        budget: budget,
        airlineBudget: airlineBudget,
        airlineDisable: airlineDisable,
        availability: availabilityQstring,
        tripDuration: tripDuration,
        weatherControlOn: weatherControlOn,
        userTempRange: temperatureRange,
        userPrecipRange: precipitationRange,
        crimeRating: crimeRating,
        selectedActivities: srcActivityCondition,
        selectedFood: srcCuisineCondition
    };

}