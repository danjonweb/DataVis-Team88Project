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
        info: 'Lorem ipsum dolor sit amet, \
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut \
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud \
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum \
        dolore eu fugiat nulla pariatur.'
      },
      {
        name: 'Hermez, Celestin',
        info: 'Data Scientist in Digital Advertising, first semester in OMSA program. He enjoyed combining the \
        algorithm with the front-end aspect, and seeing a project from start to finish.'
      },
      {
        name: 'Paul, Deborah',
        info: 'Lorem ipsum dolor sit amet, \
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut \
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud \
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum \
        dolore eu fugiat nulla pariatur.'
      },
      {
        name: 'Schultz, Chris',
        info: 'Lorem ipsum dolor sit amet, \
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut \
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud \
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum \
        dolore eu fugiat nulla pariatur.'
      },
      {
        name: 'Weber, Dan',
        info: 'Lorem ipsum dolor sit amet, \
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut \
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud \
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum \
        dolore eu fugiat nulla pariatur.'
      }

    ],
    docs: [
      {
        name: 'Proposal Doc',
        link: 'https://docs.google.com/document/d/1TmquQqko-nLgNKJWSchAl_zO-SxK1tsIuStV22CSwu8/edit'
      },
      {
        name: 'Proposal Presentation',
        link: 'https://docs.google.com/document/d/1TmquQqko-nLgNKJWSchAl_zO-SxK1tsIuStV22CSwu8/edit'
      },
      {
        name: 'Proposal Video',
        link: 'https://docs.google.com/document/d/1TmquQqko-nLgNKJWSchAl_zO-SxK1tsIuStV22CSwu8/edit'
      },
      {
        name: 'Progress Report',
        link: 'https://docs.google.com/document/d/1TmquQqko-nLgNKJWSchAl_zO-SxK1tsIuStV22CSwu8/edit'
      },
      {
        name: 'Final Poster',
        link: 'https://docs.google.com/document/d/1TmquQqko-nLgNKJWSchAl_zO-SxK1tsIuStV22CSwu8/edit'
      },
      {
        name: 'Final Report',
        link: 'https://docs.google.com/document/d/1TmquQqko-nLgNKJWSchAl_zO-SxK1tsIuStV22CSwu8/edit'
      },
      {
        name: 'Code Repository',
        link: 'https://docs.google.com/document/d/1TmquQqko-nLgNKJWSchAl_zO-SxK1tsIuStV22CSwu8/edit'
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
      } else {
        state.cities = confirmed
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
