// First define a function to find the Haversine distance between two points
// It assumes the coordinates are [lat, lon] array, isMiles determines whether the distance should be in miles or km
export function haversineDistance(coords1, coords2, isMiles) {
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

  if (isMiles) d /= 1.60934;

  return d;
}

export function sortAirports(a, b) {
  if (a.distance < b.distance)
    return -1;
  if (a.distance > b.distance)
    return 1;
  return 0;
}

/* A function which, given a lat-lon array (origin) and an array of airport objects (read from the DB)
returns the closest n airports within a defined radius*/
export function findClosestAirports(origin, airports, nAirports, radius) {

  // Initialize an array to hold the distance with each airport
  var airportDistance = []
  var closeAirports
  var closestAirports
  var closestAirportCodes

  // Get the distance with each airport coordinates
  airports.forEach(element => {
    airportDistance.push({
      'airportCoordinates': [element.latitude, element.longitude],
      'airportCode': element.iata_code,
      'distance': haversineDistance(origin,
        [element.latitude, element.longitude], true)
    });
  });

  // Check if any airport is within the radius
  if (airportDistance.some(function (element) { return element.distance <= radius; })) {
    // Only keep the airports within the radius
    closeAirports = airportDistance.filter(function (airport) { return airport.distance <= radius; })

    // Keep n airports
    closestAirports = closeAirports.sort(sortAirports).slice(0, nAirports);

    // Extract the airport codes
    closestAirportCodes = []
    closestAirports.forEach(function (x) {
      closestAirportCodes.push(
        {
          code: x.airportCode,
          distancs: x.distance,
          location: x.airportCoordinates
        });
    })
  } else {
    // Sort the airports based on their distance and keep the closest one
    closestAirports = airportDistance.sort(sortAirports)[0];

    closestAirportCodes = [{
      code: closestAirports.airportCode,
      distancs: closestAirports.distance,
      location: closestAirports.airportCoordinates
    }];
  }


  return closestAirportCodes
}