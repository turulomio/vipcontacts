
import { defineStore } from 'pinia'
import axios from 'axios'
import { myheaders, parseResponseError,sortObjectsArray} from './functions.js'


export const useStore = defineStore('global', {
  state: () => {
    return { 
        token:null,
        logged:false,
        version: "0.1.0",
        versiondate: new Date(2022, 1, 20, 20, 46),
        apiroot: import.meta.env.VITE_DJANGO_VIPCONTACTS_URL,
        publicPath: import.meta.env.VITE_PUBLIC_PATH,
        lastsearch: null,
        persongender:[],
        countries: [],
        addresstype: [],
        mailtype: [],
        logtype:[],
        relationshiptype: [],
        mimetype:[],
    }
  },
  actions: {
    setToken(token){
      this.token=token
      if (this.token){
        this.logged=true
      } else {
        this.logged=false
      }
    },
    updateOptions() {
        var start=new Date()
        return axios.options(`${this.apiroot}/api/person/`, myheaders())
        .then((response) => {
            this.persongender= sortObjectsArray(response.data.actions.POST.gender.choices, "display_name")
            this.countries= sortObjectsArray(response.data.actions.POST.address.child.children.country.choices, "display_name")
            this.addresstype= sortObjectsArray(response.data.actions.POST.address.child.children.retypes.choices, "display_name")
            this.mailtype= sortObjectsArray(response.data.actions.POST.mail.child.children.retypes.choices, "display_name")
            this.phonetype= sortObjectsArray(response.data.actions.POST.phone.child.children.retypes.choices, "display_name")
            this.logtype= sortObjectsArray(response.data.actions.POST.log.child.children.retypes.choices, "display_name")
            this.relationshiptype=sortObjectsArray(response.data.actions.POST.relationship.child.children.retypes.choices, "display_name")
            this.mimetype= sortObjectsArray(response.data.actions.POST.blob.child.children.mime.choices, "display_name")
            console.log(`Updated options in ${new Date()-start} ms`)
        }, (error) => {
            parseResponseError(error)
        });
    },

    updateAll(){
      return Promise.all([
        this.updateOptions(),
      ])
    },
  }
})
