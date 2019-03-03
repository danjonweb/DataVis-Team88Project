import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showAbout: true,

    menus: [
      {
        name: "Budget",
        image: "budget.png",
        type: "slider"
      },
      {
        name: "Availability",
        image: "avail.png",
        type: "date-range"
      },
      {
        name: "Weather",
        image: "weather.png",
        type: "inputs"
      },
      {
        name: "Activity",
        image: "active.png",
        type: "multi-select"
      },
      {
        name: "Culinary",
        image: "Culinary.png",
        type: "slider"
      },
      {
        name: "Crime",
        image: "crime.png",
        type: "muli-select"
      }
    ],

    cities: [
      {
        code: "OTT",
        city: "OTTAWA",
        country: "CANADA",
        lat: "23.10",
        lon: "120.34"
      },
      {
        code: "BSB",
        city: "BRASILIA",
        country: "BRAZIL",
        lat: "-32.85",
        lon: "133.30"
      },
      { 
        code: "DEL", 
        city: "DELHI", 
        country: "INDIA", 
        lat: "4.71", 
        lon: "-127.57" },
      {
        code: "CMX",
        city: "CIDADE DO MÉXICO",
        country: "MÉXICO",
        lat: "0.42",
        lon: "93.19"
      },
      {
        code: "SID",
        city: "SIDNEY",
        country: "AUSTRALIA",
        lat: "-48.38",
        lon: "-71.71"
      },
      {
        code: "TOK",
        city: "TOQUIO",
        country: "JAPÃO",
        lat: "17.34",
        lon: "-81.73"
      },
      {
        code: "CCA",
        city: "CIDADE DO CABO",
        country: "AFRICA DO SUL",
        lat: "-43.20",
        lon: "-171.97"
      },
      {
        code: "CMP",
        city: "CAMPO GRANDE",
        country: "BRASIL",
        lat: "-36.15",
        lon: "130.72"
      },
      {
        code: "PAR",
        city: "PARIS",
        country: "FRANÇA",
        lat: "22.19",
        lon: "174.27"
      },
      {
        code: "NOY",
        city: "NOVA YORK",
        country: "USA",
        lat: "11.23",
        lon: "112.96"
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

  },
  actions: {
    showHideAboutAction(context, payload) {
      context.commit('showHideAboutMutation', payload);
    },
  },
});
