// First define a function to find the Haversine distance between two points
// It assumes the coordinates are [lat, lon] array, isMiles determines whether the distance should be in miles or km
function haversineDistance(coords1, coords2, isMiles) {
    function toRad(x) {
      return x * Math.PI / 180;
    }
  
    var lon1 = coords1[1];
    var lat1 = coords1[0];
  
    var lon2 = coords2[1];
    var lat2 = coords2[0];
  
    var R = 6371; // km
  
    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
  
    if(isMiles) d /= 1.60934;
  
    return d;
  }

function sortAirports(a,b) {
    if (a.distance < b.distance)
        return -1;
    if (a.distance > b.distance)
        return 1;
    return 0;
}

/* A function which, given a lat-lon array (origin) and an array of airport objects (read from the DB)
returns the closest n airports within a defined radius*/
function findClosestAirports(origin, airports, nAirports, radius) {
    
    // Initialize an array to hold the distance with each airport
    var airportDistance = []

    // Extract coordinates of each airport
    var airportCoordinates = airports.map(function(x) {return x.coordinates;})

    // Get the distance with each airport coordinates
    airportCoordinates.forEach(element => {
        airportDistance.push({'airportCoordinates': element,
                              'distance': haversineDistance(origin, element, true)
            });
    });

    // Extract the n closest airports
    var closestAirports = airportDistance.sort(sortAirports).slice(0, nAirports);

    // Check the distance is less than the desired radius
    // Return if less than radius
    // If nothing within the radius, return the closest one

    // // Check the distance is less than the desired radius
    // closest_airports_radius = [u for u, v in closest_airports if v <= radius]

    // // Get the airport codes for all the coordinates in the list
    // airport_codes = []
    // for close_airport in closest_airports_radius:
    //     airport_codes.append(airport_df.loc[airport_df.coordinates == close_airport, 'iata_code'].values[0])

    // if len(airport_codes) < n_airports:
    //     return(airport_codes + (n_airports - len(airport_codes)) * [''])

    // else:
    //     return airport_codes
}