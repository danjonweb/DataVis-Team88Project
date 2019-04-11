import * as axios from "axios";

export async function ReturnDestinations(
    candidateCityIDsArray,
    candidateCityIDsString,
    monthCondition,
    priceBudgetAir,
    minTemp,
    maxTemp,
    minPrecip,
    maxPrecip
) {
    console.log(monthCondition)
    console.log(candidateCityIDsArray)
    console.log(candidateCityIDsString)
    console.log(priceBudgetAir)



    const response = await axios.get('http://localhost:3000/algorithm', {
        params: {
            candidateCityIDsArray: candidateCityIDsArray,
            priceBudgetAir: priceBudgetAir,
            minTemp: minTemp,
            maxTemp: maxTemp,
            minPrecip: minPrecip,
            maxPrecip: maxPrecip
        }
    });
    console.log(typeof(response.data))
    console.log(response.data)


}