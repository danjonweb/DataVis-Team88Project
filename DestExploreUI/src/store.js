import Vue from 'vue';
import Vuex from 'vuex';
import * as axios from "axios";
import { findClosestAirports, haversineDistance } from "@/helpers/find_closest_airports"
import { ReturnDestinations } from "@/helpers/algorithm"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    databaseOnline: true,
    noResultsFound: false,
    showAbout: true,
    legendLayout: [
      {
        name: "Rank #1",
        color: "#08519c"
      },
      {
        name: "Rank #2",
        color: "#3182bd"
      },
      {
        name: "Rank #3",
        color: "#6baed6"
      },
      {
        name: "Rank #4",
        color: "#bdd7e7"
      },
      {
        name: "Rank #5",
        color: "#eff3ff"
      }
    ],
    userLatLon: [],
    numResults: 5,
    budget: 1200,
    dailySpend: 120,
    airlineDisable: false,
    drivingDistance: 600,
    availability: { startDate: null, endDate: null },
    tripDuration: 3,
    weatherControlOn: false,
    simpleTempRanges: {
      lowLow: 0,
      lowHigh: 49,
      midLow: 50,
      midHigh: 77,
      highLow: 78,
      highHigh: 99
    },
    simplePrecipRanges: {
      dryLow: 0,
      dryHigh: 2,
      avgLow: 3,
      avgHigh: 25,
      wetLow: 26,
      wetHigh: 100
    },

    userTempRange: { low: 50, high: 77 },
    userPrecipRange: { low: 3, high: 25 },

    activityOptions: {},
    selectedActivities: [],

    culinaryOptions: [],
    selectedFood: [],

    crimeRating: 200,

    airPorts: [],
    closestAirports: [],

    candidateCities: [],

    cities: [],

    members: [
      {
        name: 'Fu, Yaoyao',
        info: 'Scientist in onco-immunology and self-learner of programming language and algorithm, \
        first semester in the OMSCS program. Interested in visualizing complex biomedical data with \
        powerful computer tools. Interested in visualizing complex biomedical data with powerful computer tools.'
      },
      {
        name: 'Hermez, Celestin',
        info: 'Data Scientist in Digital Advertising, first semester in OMSA program. He enjoyed combining the \
        algorithm with the front-end aspect, and seeing a project from start to finish.'
      },
      {
        name: 'Paul, Deborah',
        info: 'Edison Engineering Development Program at Baker Hughes GE \
        Currently pursuing the Computational Data Analytics Track of the OMSA degree. \
        Enjoying learning how to visualize data to form valuable insights.'
      },
      {
        name: 'Schultz, Chris',
        info: 'Research Engineer at Levi Strauss, \
        6 classes into the OMSCS program with a focus on Machine Learning. \
        Enjoys bringing interactivity to powerful algorithmic techniques.'
      },
      {
        name: 'Weber, Dan',
        info: 'Computer science and math teacher. This is my 6th class in OMSCS. Interested in crafting \
        beautiful and intuitive interfaces in front of complex backends.'
      }

    ],
    docs: [
      {
        name: 'Proposal Doc',
        link: 'https://docs.google.com/document/d/1TmquQqko-nLgNKJWSchAl_zO-SxK1tsIuStV22CSwu8/edit?usp=sharing'
      },
      {
        name: 'Proposal Presentation',
        link: 'https://docs.google.com/presentation/d/1V3CTYqQaXwWKIdJh_GlczySb6R4C_XdsWmln71MIrEg/edit?usp=sharing'
      },
      {
        name: 'Proposal Video',
        link: 'https://www.youtube.com/watch?v=DAr3hqP1Hmg&feature=youtu.be'
      },
      {
        name: 'Installation Video',
        link: 'https://www.youtube.com/watch?v=2WE4b2ZktP8&feature=youtu.be.'
      },
      {
        name: 'Code README.txt',
        link: 'https://docs.google.com/document/d/1dpYE4C2S5FtAHInTOjy2lWiNr9TnB88F8_NgHXDyOXo/edit?usp=sharing'
      },
      {
        name: 'Demo Video',
        link: 'https://www.youtube.com/watch?v=naa9-2eOJ8I&feature=youtu.be'
      },
      {
        name: 'Final Report',
        link: 'https://docs.google.com/document/d/16X_S9iEPRYSUOzEo--uOEHmNW1k0ccpwk7-7fK1TMx4/edit?usp=sharing'
      },
      {
        name: 'Code Repository',
        link: 'https://github.com/SchultzC/DataVis-Team88Project'
      },
    ]

  },
  mutations: {
    databaseOnlineStatus(state, payload) {
      state.databaseOnline = payload
    },

    showHideAboutMutation(state, payload) {
      state.showAbout = payload;
    },

    setUserLatLon(state, payload) {
      state.userLatLon = payload
    },

    setBudgetMutation(state, payload) {
      state.budget = payload
    },

    setAirlineDisableMutation(state, payload) {
      state.airlineDisable = payload
    },

    setAvailabilityMutation(state, payload) {
      state.availability = payload
    },

    setTripDurationMutation(state, payload) {
      state.tripDuration = payload
    },

    setEnableWeatherMutation(state, payload) {
      state.weatherControlOn = payload
    },

    setUserTempRangeMutation(state, payload) {
      state.userTempRange = payload
    },

    setUserPrecipRangeMutation(state, payload) {
      state.userPrecipRange = payload
    },

    setselectedActivitiesMutation(state, payload) {
      state.selectedActivities = payload
    },

    setSelectedCulinaryMutation(state, payload) {
      state.selectedFood = payload
    },

    setCrimeRatingMutation(state, payload) {
      state.crimeRating = payload
    },

    setAirports(state, payload) {
      state.airPorts = payload
    },

    setClosestAirports(state, payload) {
      var closestAirports = findClosestAirports(payload, state.airPorts, 3, 1000)
      state.closestAirports = closestAirports
    },

    setActivities(state, payload) {
      var activity_category
      var processed_activities = {}
      payload.forEach((activity) => {
        activity_category = activity.category_activity
        if (activity_category in processed_activities) {
          processed_activities[activity_category].push(activity.activity_name)
        }
        else {
          processed_activities[activity_category] = [activity.activity_name]
        }

      })
      state.activityOptions = processed_activities

    },

    setCuisineOptionsMutation(state, payload) {
      var collectedFood = []
      payload.forEach((cuisine) => {
        collectedFood.push(cuisine.cuisine)
      })
      state.culinaryOptions = collectedFood
    },

    setCandidateCities(state, payload) {
      state.databaseOnline = true
      var collectedCandidates = []
      if (payload === '') {
        state.noResultsFound = true
      } else {
        payload.forEach((cities) => {
          collectedCandidates.push(cities.cid)
        })
        state.noResultsFound = false
        state.candidateCities = collectedCandidates.slice(0, 950)
      }
    },

    setCities(state, payload) {
      let confirmed = []
      // eslint-disable-next-line
      // console.log(`cid,city_name,activities,crime,cuisine,distance,flight_price,lat,lng,matching_score,prcp,temp`)
      if (state.airlineDisable) {
        payload.forEach((city) => {

          let distance = haversineDistance([city.lat, city.lng], [this.state.userLatLon[1], this.state.userLatLon[0]], true)
          if (distance < this.state.drivingDistance) {
            confirmed.push(city)
          }
        })
      } else {
        confirmed = payload
      }

      if (confirmed.length === 0) {
        this.state.noResultsFound = true
      } else {
        this.state.noResultsFound = false
      }

      if (confirmed.length > state.numResults) {
        state.cities = confirmed.slice(0, state.numResults)

        // state.cities.forEach((city) => {
        // eslint-disable-next-line
        // console.log(`${city.cid},${city.city_name},${city.activities},${city.crime},${city.cuisine},${city.distance},${city.flight_price},${city.lat},${city.lng},${city.matching_score},${city.prcp},${city.temp}`)
        // })
      } else {
        state.cities = confirmed
        // state.cities.forEach((city) => {
        // eslint-disable-next-line
        // console.log(`${city.cid},${city.city_name},${city.activities},${city.crime},${city.cuisine},${city.distance},${city.flight_price},${city.lat},${city.lng},${city.matching_score},${city.prcp},${city.temp}`)
        // })
      }
      // eslint-disable-next-line
      console.log(state.cities)

    }

  },
  actions: {
    showHideAboutAction(context, payload) {
      context.commit('showHideAboutMutation', payload);
    },

    setStartingLocation(context, payload) {
      context.commit('setUserLatLon', payload)
    },

    setBudgetAction(context, payload) {
      context.commit('setBudgetMutation', payload);
    },

    setAirlineDisable(context, payload) {
      context.commit('setAirlineDisableMutation', payload);
    },

    async getAllAirports(context) {
      try {
        const response = await axios.get('http://localhost:3000/airports');
        var good_data = []
        response.data.forEach((aport) => {
          if (aport.iata_code !== "\\N") {
            good_data.push(aport)
          }
        })
        context.commit('setAirports', good_data);

      } catch (error) {
        context.commit('databaseOnlineStatus', false);
      }
    },

    async getAllActivities(context) {
      try {
        const response = await axios.get('http://localhost:3000/activity');
        context.commit('setActivities', response.data);

      } catch (error) {
        context.commit('databaseOnlineStatus', false);
      }
    },

    async getAllCuisine(context) {
      try {
        const response = await axios.get('http://localhost:3000/cuisine');
        context.commit('setCuisineOptionsMutation', response.data);

      } catch (error) {
        context.commit('databaseOnlineStatus', false);
      }
    },

    setAvailability(context, payload) {
      context.commit('setAvailabilityMutation', payload)
    },

    setTripDuration(context, payload) {
      context.commit('setTripDurationMutation', payload)
    },

    setEnableWeather(context, payload) {
      context.commit('setEnableWeatherMutation', payload);
    },

    setUserTempRange(context, payload) {
      context.commit('setUserTempRangeMutation', payload)
    },

    setUserPercipRange(context, payload) {
      context.commit('setUserPrecipRangeMutation', payload)
    },

    setSelectedActivities(context, payload) {
      context.commit('setselectedActivitiesMutation', payload)
    },

    setSelectedCulinary(context, payload) {
      context.commit('setSelectedCulinaryMutation', payload)
    },

    setCrimeRating(context, payload) {
      context.commit('setCrimeRatingMutation', payload)
    },

    getClosestAirports(context, payload) {
      context.commit('setClosestAirports', payload)
    },

    async calculateCandidateCities(context, payload) {
      // console.log('calculating candidates', payload)
      try {
        const response = await axios.get('http://localhost:3000/filteredcandidates', {
          params: {
            airlineBudget: payload.airlineBudget,
            userAirports: payload.closestAirports,
            availability: payload.availability,
            minTemp: payload.userTempRange[0],
            maxTemp: payload.userTempRange[1],
            minPrecip: payload.userPrecipRange[0],
            maxPrecip: payload.userPrecipRange[1],
            maxCrime: payload.crimeRating
          }
        });
        context.commit('setCandidateCities', response.data);

      } catch (error) {
        context.commit('databaseOnlineStatus', false);
      }
    },

    async calculateCityScores(context, payload) {

      let RankedCities = await ReturnDestinations(
        payload.candidateCities,
        payload.candidateCitiesString,
        payload.closestAirports,
        payload.availability,
        payload.airlineBudget,
        payload.userTempRange[0],
        payload.userTempRange[1],
        payload.userPrecipRange[0],
        payload.userPrecipRange[1],
        payload.selectedActivities,
        payload.selectedFood
      )

      context.commit('setCities', RankedCities)
    }

  },
});
