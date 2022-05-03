import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {sortObjectsArray} from './components/reusing/my_commons.js'
Vue.use(Vuex);


export const store = new Vuex.Store({
    state: {
        token:null,
        logged:false,
        version: "0.1.0",
        versiondate: new Date(2022, 1, 20, 20, 46),
        apiroot: process.env.VUE_APP_DJANGO_VIPCONTACTS_URL,
        publicPath: process.env.VUE_APP_PUBLIC_PATH,
        lastsearch: null,
        persongender:[],
        countries: [],
        addresstype: [],
        mailtype: [],
        logtype:[],
        relationshiptype: [],
        mimetype:[],
    },    
    getters:{
        getObjectByUrl:(state) => (catalog,url,default_=null) => {
            var r=state[catalog].find(o => o.url==url)
            if (r==null){
                return default_
            } else {
                return r
            }
        },
        getObjectById:(state) => (catalog,id,default_=null) => {
            var r=state[catalog].find(o => o.id==id)
            if (r==null){
                return default_
            } else {
                return r
            }
        },
        //Dv Value (for options catalogs)
        getObjectByValue:(state) => (catalog,v,default_=null) => {
            var r=state[catalog].find(o => o.value==v)
            if (r==null){
                return default_
            } else {
                return r
            }
        },
        getObjectPropertyByValue:(state,getters) => (catalog,v,property,default_=null) => {
            var r=getters.getObjectByValue(catalog,v)
            if (r==null){
                return default_
            } else {
                return r[property]
            }
        },
        getObjectPropertyByUrl:(state,getters) => (catalog,url,property,default_=null) => {
            var r=getters.getObjectByUrl(catalog,url)
            if (r==null){
                return default_
            } else {
                return r[property]
            }
        },
        getObjectPropertyById:(state,getters) => (catalog,id,property,default_=null) => {
            var r=getters.getObjectById(catalog,id)
            if (r==null){
                return default_
            } else {
                return r[property]
            }
        },
    },
    mutations: { // Only sincronous changes data
        updateOptions: (state, payload) =>{
            state.persongender= sortObjectsArray(payload.actions.POST.gender.choices, "display_name")
            state.countries= sortObjectsArray(payload.actions.POST.address.child.children.country.choices, "display_name")
            state.addresstype= sortObjectsArray(payload.actions.POST.address.child.children.retypes.choices, "display_name")
            state.mailtype= sortObjectsArray(payload.actions.POST.mail.child.children.retypes.choices, "display_name")
            state.phonetype= sortObjectsArray(payload.actions.POST.phone.child.children.retypes.choices, "display_name")
            state.logtype= sortObjectsArray(payload.actions.POST.log.child.children.retypes.choices, "display_name")
            state.relationshiptype=sortObjectsArray(payload.actions.POST.relationship.child.children.retypes.choices, "display_name")
            state.mimetype= sortObjectsArray(payload.actions.POST.blob.child.children.mime.choices, "display_name")

        },
    },
    actions: {// Can be asynchronous. Fetch data

        getAll(context){
            return context.dispatch("getOptions")
        },
        getOptions(context){
            var start=new Date()
            return axios.options(`${store.state.apiroot}/api/persons/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateOptions', response.data)
                console.log(`Updated options in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
    }
})
