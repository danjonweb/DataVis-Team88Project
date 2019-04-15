 /* eslint-disable */
import * as axios from "axios";

export async function ReturnDestinations(
    candidateCityIDsArray,
    candidateCityIDsString,
    closestAirports,
    availabilityString,
    priceBudgetAir,
    minTemp,
    maxTemp,
    minPrecip,
    maxPrecip,
    selectedActivities,
    selectedFood
) {



    const response = await axios.get('http://localhost:3000/algorithm', {
        params: {
            candidateCityIDsArray: candidateCityIDsArray,
            candidateCityIDsString: candidateCityIDsString,
            closestAirports: closestAirports,
            priceBudgetAir: priceBudgetAir,
            availabilityString: availabilityString,
            minTemp: minTemp,
            maxTemp: maxTemp,
            minPrecip: minPrecip,
            maxPrecip: maxPrecip,
            selectedActivities: selectedActivities,
            selectedFood: selectedFood

        }
    });
    let candidateFeatures = response.data.candidateFeatures
    let userInputFeatures = response.data.userInputFeatures
    // console.log(response.data)

    let rankedCandidates = await rankCandidateCities(
        candidateFeatures,
        userInputFeatures,
        {
            flight_price: 3,
            temp: 2,
            prcp: 2,
            crime: 3,
            activities: 5,
            cuisine: 5
        },
        euclideanDistance, // use euclideandistance, change to "cosineSimilarityDistance" if you want to use cosine similiarity
    )
    return rankedCandidates
    // console.log(rankedCandidates)


}

function euclideanDistance(v1, v2) {
    let sum = 0;
    for (let i = 0; i < v1.length; i++) {
        sum += (v1[i] - v2[i]) * (v1[i] - v2[i]);
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

    for (let i = 0; i < v1.length; i++) {
        dotProduct += v1[i] * v2[i]
        v1VecLength += v1[i] * v1[i]
        v2VecLength += v2[i] * v2[i]
    }
    return 1 - dotProduct / Math.sqrt(v1VecLength) / Math.sqrt(v2VecLength);
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

    let stdev = 0;
    for (let v of list) {
        stdev += (v - mean) * (v - mean)
    }
    stdev /= list.length;
    stdev = Math.sqrt(stdev);
    return [mean, stdev]
}

function convertToList(obj, keyList) {
    let valList = []
    for (let k of keyList) {
        if (isNaN(obj[k])) {
            valList.push(0.001)
        } else {
            valList.push(obj[k])
        }

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


    let featureList = [
        "flight_price",
        "temp",
        "prcp",
        "crime",
        "activities",
        "cuisine"
    ]

    // first normalize each feature to be zero mean and unit variance
    for (let feature of featureList) {
        let featureVals = []
        // iterate through each feature vector
        for (let k of Object.keys(featureMatrix)) {
            if (featureMatrix[k][feature] !== undefined) {
                featureVals.push(featureMatrix[k][feature])
            } else {
                featureVals.push(0)
            }


        }


        // compute mean and standard deviation of the feature
        let data = computeMeanStdev(featureVals)
        let mean = data[0]
        let stdev = data[1]

        // normalize by subtract mean and divide standard diviation
        for (let k of Object.keys(featureMatrix)) {
            if (featureMatrix[k][feature] !== undefined) {
                featureMatrix[k][feature] = (featureMatrix[k][feature] - mean) / stdev * userPriority[feature]
            } else {

                featureMatrix[k][feature] = (0 - mean) / stdev * userPriority[feature]
            }
        }
    }

    let userFeatureVector = convertToList(featureMatrix['user'], featureList)

    // console.log("user feature vector:", userFeatureVector)
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
            spread = max_dist - min_dist
        }
    }

    let finalCandidateFeatureList = [];

    for (let cid of Object.keys(candidateFeatures)) {
        candidateFeatures[cid]["matching_score"] = 100 - (candidateFeatures[cid]["distance"] - min_dist) * 25 / spread
        finalCandidateFeatureList.push(candidateFeatures[cid])
    }

    // sort by matching_score
    finalCandidateFeatureList.sort((a, b) => (a.matching_score < b.matching_score) ? 1 : -1)
    return finalCandidateFeatureList
}