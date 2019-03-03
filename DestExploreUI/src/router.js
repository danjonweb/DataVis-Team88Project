import Vue from 'vue';
import Router from 'vue-router';
import Team88Home from './views/Home.vue';
import Team88About from './views/About.vue';
import Team88Project from './views/ProjectDocs.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'team88home',
      component: Team88Home,
    },
    {
      path: '/about',
      name: 'team88about',
      component: Team88About,
    },
    {
      path: '/project',
      name: 'team88project',
      component: Team88Project,
    },
  ],
});
