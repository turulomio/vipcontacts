import { createRouter,createWebHistory } from "vue-router";
import About from './components/about'
import Home from './components/Home'
import GroupMembers from './components/GroupMembers'
import PersonLastEditions from './components/PersonLastEditions'
import PersonsMerge from './components/PersonsMerge.vue'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import TableTypes from './components/TableTypes.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: `${import.meta.env.BASE_URL}/`, redirect: `${import.meta.env.BASE_URL}/home/` }, 
    { path: `${import.meta.env.BASE_URL}/home/`, name: 'home', component: Home },
    { path: `${import.meta.env.BASE_URL}/about/`, name: 'about', component: About },
    { path: `${import.meta.env.BASE_URL}/settings/`, name: 'settings', component: Settings },
    { path: `${import.meta.env.BASE_URL}/statistics/`, name: 'statistics', component: Statistics },
    { path: `${import.meta.env.BASE_URL}/group/members/`, name: 'group_members', component: GroupMembers },
    { path: `${import.meta.env.BASE_URL}/person/lasteditions/`, name: 'person_last_edited', component: PersonLastEditions },
    { path: `${import.meta.env.BASE_URL}/persons/merge/`, name: 'persons_merge', component: PersonsMerge },
    { path: `${import.meta.env.BASE_URL}/administration/types/`, name: 'administration_types', component: TableTypes},
  ]
})