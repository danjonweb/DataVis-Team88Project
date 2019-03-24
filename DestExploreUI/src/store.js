import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showAbout: true,
    budget: 1000,

    selectedActivities: [],

    activityOptions: [
      { text: "Backpacking", value: "backpacking", disabled: false },
      { text: "Concerts", value: "concerts", disabled: false },
      { text: "Fishing", value: "fishing", disabled: false },
      { text: "Gambling", value: "gambling", disabled: false },
      { text: "Golfing", value: "golfing", disabled: false },
      { text: "Museums", value: "museums", disabled: false },
      { text: "Professional Sports", value: "professional sports", disabled: false },
      { text: "Sky Diving", value: "sky diving", disabled: false },
      { text: "Tours", value: "tours", disabled: false },
      { text: "Water Sports", value: "water sports", disabled: false }
    ],

    selectedFood: [],

    culinaryOptions: [
      { text: "American", value: "american", disabled: false },
      { text: "Chinese", value: "chinese", disabled: false },
      { text: "French", value: "french", disabled: false },
      { text: "Greek", value: "greek", disabled: false },
      { text: "Indian", value: "indian", disabled: false },
      { text: "Italian", value: "italian", disabled: false },
      { text: "Japanese", value: "japanese", disabled: false },
      { text: "Korean", value: "korean", disabled: false },
      { text: "Lebanese", value: "lebanese", disabled: false },
      { text: "Mexican", value: "mexican", disabled: false },
      { text: "Soul Food", value: "soul", disabled: false },
      { text: "Thai", value: "thai", disabled: false },
      { text: "Vietnamese", value: "vietnamese", disabled: false }
    ],

    crimeRating: 1.5,

    cities: [
      {
        code: "SFO",
        city: "San Francisco",
        country: "USA",
        lat: "37.7576793",
        lon: "-122.5076401",
        cost: 0
      },
      {
        code: "NYC",
        city: "New York",
        country: "USA",
        lat: "40.6971478",
        lon: "-74.2605541",
        cost: 3700.0
      },
      {
        code: "MCO",
        city: "Orlando",
        country: "USA",
        lat: "28.4810968",
        lon: "-81.5091793",
        cost: 2000.0
      },
      {
        code: "LAX",
        city: "Los Angeles",
        country: "USA",
        lat: "34.0201597",
        lon: "-118.6926093",
        cost: 700.0
      },
      {
        code: "PIT",
        city: "Pittsburg",
        country: "USA",
        lat: "40.4312835",
        lon: "-80.1209284",
        cost: 1700.0
      },
      {
        code: "SEA",
        city: "Seattle",
        country: "USA",
        lat: "47.6129428",
        lon: "-122.4824913",
        cost: 900.0
      },
      {
        code: "ANK",
        city: "Anchorage",
        country: "USA",
        lat: "61.1042033",
        lon: "-150.5639306",
        cost: 4000.0
      },
      {
        code: "HON",
        city: "Honolulu",
        country: "USA",
        lat: "21.3279755",
        lon: "-157.939503",
        cost: 4500.0
      },
      {
        code: "BLX",
        city: "Biloxi",
        country: "USA",
        lat: "30.4265027",
        lon: "-88.9958055",
        cost: 1200.0
      },
      {
        code: "BLD",
        city: "Boulder",
        country: "USA",
        lat: "40.0292887",
        lon: "-105.3101892",
        cost: 950.0
      },
      {
        code: "MIA",
        city: "Miami",
        country: "USA",
        lat: "25.7825453",
        lon: "-80.299499",
        cost: 3000.0
      },
      {
        code: "ALB",
        city: "Albany",
        country: "USA",
        lat: "42.6681893",
        lon: "-73.8807211",
        cost: 2700.0
      },
      {
        code: "AUS",
        city: "Austin",
        country: "USA",
        lat: "30.3080553",
        lon: "-98.0335947",
        cost: 1000
      },
      {
        code: "RAL",
        city: "Raleigh",
        country: "USA",
        lat: "35.843965",
        lon: "-78.7851415",
        cost: 3800.0
      }
    ],

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
        info: 'Lorem ipsum dolor sit amet, \
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut \
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud \
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum \
        dolore eu fugiat nulla pariatur.'
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
    showHideAboutMutation(state, payload) {
      state.showAbout = payload;
    },

    modCitiesMutate(state) {
      state.cities.pop()

    },

    setBudgetMutation(state, payload) {
      state.budget = payload
    }
  },
  actions: {
    showHideAboutAction(context, payload) {
      context.commit('showHideAboutMutation', payload);
    },
    modCities(context) {
      context.commit('modCitiesMutate')
    },
    setBudgetAction(context, payload) {
      context.commit('setBudgetMutation', payload);
    },
  },
});
