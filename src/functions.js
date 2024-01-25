import vCardsJS from 'vcards-js'
import { useStore}  from '@/store'

// Function to use "{0} {1}".format(a, b) style
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};



export function myheaders(){
    return {
        headers:{
            'Authorization': `Token ${useStore().token}`,
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type':'application/json'
        }
    }
}


export function myheaders_noauth(){
    return {
        headers:{
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type':'application/json'
        }
    }
}

export function myheaders_formdata(){
    return {
        headers:{
            'Authorization': `Token ${useStore().token}`,
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type': 'multipart/form-data'
        }
    }
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


export function sortObjectsArray(objectsArray, sortKey)
{
    // Quick Sort:
    var retVal;

    if (1 < objectsArray.length)
    {
        var pivotIndex = Math.floor((objectsArray.length - 1) / 2);  // middle index
        var pivotItem = objectsArray[pivotIndex];                    // value in the middle index
        var less = [], more = [];

        objectsArray.splice(pivotIndex, 1);                          // remove the item in the pivot position
        objectsArray.forEach(function(value)
        {
            value[sortKey] <= pivotItem[sortKey] ?                   // compare the 'sortKey' proiperty
                less.push(value) :
                more.push(value) ;
        });

        retVal = sortObjectsArray(less, sortKey).concat([pivotItem], sortObjectsArray(more, sortKey));
    }
    else
    {
        retVal = objectsArray;
    }
    
    return retVal;
}

// returns true if everything is ok
// return false if there is something wrong
export function parseResponse(response){
    if (response.status==200){ //Good connection
        if (response.data == "Wrong credentials"){
            useStore().token=null
            useStore().logged=false
            alert(this.$t("Wrong credentials"))
            return false
        }
        return true
    } else if (response.status==201){// Created
        
    } else if (response.status==204){// Deleted
    } else {
        alert (`${response.status}: ${response.data}`)
        return false
    }
}

export function parseResponseError(error){
    if (error.response) {
      // Request made and server responded
        console.log("made and responded")
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
        if (error.response.status == 401){
            alert ("You aren't authorized to do this request")
            useStore().token=null;
            useStore().logged=false;
            if (this.$router.currentRoute.name != "home") this.$router.push({name:"home"})
            console.log(error.response)
        } else if (error.response.status == 400){ // Used for developer or app errors
            alert ("Something wrong with your request")
            console.log(error.response)
        } else if (error.response.status == 500){
            alert ("There is a server error")
            console.log(error.response)
        }
        
    } else if (error.request) {
        console.log("The request was made but no response was received")
        alert (this.$t("Server couldn't answer this request"))
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
        console.log("OTROS")
        console.log('Error', error.message);
    }
}

export function arrayobjects_to_stringofstrings(l, key){
    var s=""
    l.forEach(o => s=s+o[key].toString() + ", ")
    return s.slice(0,-2)
}


export function listobjects_sum(lo,key){
    return lo.reduce((accum,item) => accum + item[key], 0)
}


// Generate a hyperlinked_url (DRF hyperlinked url) from model and id uses $sotre for apiroot
export function hyperlinked_url(model,id){
    return `${useStore().apiroot}/api/${model}/${id}/`
}

//Gets id (integer) from an hyperlinked_url(DRF hyperlinked ul)
export function id_from_hyperlinked_url(url){
    let r=url.split("/") //[ "http:", "", "localhost:8011", "api", "additive_risks", "0", "" ]
    return parseInt(r[r.length-2])
}

// file is the value of v-file-input. La funcion donde se pone la función debe ser async y para recibir valor const l= await getBase64(file)
// Returns an object with image in base64, jsimage, and mime parameters
export function getBase64(file) {
    // Returns a promise which gets resolved or rejected based on the reader events
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // Sets up even listeners BEFORE you call reader.readAsDataURL
        reader.onload = function () {
            const result = reader.result
            var r={
                jsimage: result,
                image: result.split(",")[1],
                mime: result.split(";base64,")[0].split(":")[1],
            }
            return resolve(r)
        };
        reader.onerror = function (error) {
            return reject(error);
        };
        // Calls reader function
        console.log(typeof file)
        reader.readAsDataURL(file);
    })
}


export function age_today(birth_iso_string) {
    return age_in_a_date(birth_iso_string, new Date().toISOString())
}

export function age_in_a_date(birth_iso_string, date_iso_string) {
    //The magic number: 31557600000 is 24 * 3600 * 365.25 * 1000 
    // ~~ Math.floor  
    var birth = new Date(birth_iso_string)
    var date = new Date(date_iso_string)
    if (birth.getDate()==date.getDate() && birth.getMonth()==date.getMonth()){ // To avoid decimal errors in birthday
        return date.getFullYear()-birth.getFullYear()
    } else {
        return ~~((date - birth ) / (31557600000));
    }
}

export function getLocalStorage(key, default_){
    if (localStorage.getItem(key)){
        return localStorage.getItem(key)
    } else {
        return default_
    }
    
}


export function generateVcardObject(person){
    var vCard = vCardsJS();
    vCard.firstName = person.name;
    vCard.middleName = person.surname;
    vCard.lastName = person.surname2;
    if (person.birth) vCard.birthday = new Date(person.birth)
    vCard.cellPhone=person.phone.filter(function(o) {
        if (o.dt_obsolete==null) {
            return true; // skip
        }
        return false;  
    }).map(function(o) {
        return o.phone
    });
    vCard.email=person.mail.filter(function(o) {
        if (o.dt_obsolete==null) {
            return true; // skip
        }
        return false;  
    }).map(function(o) {
        return o.mail
    });
    return vCard
}

export function getObjectByUrl(catalog,url,default_=null)  {
    var r=useStore()[catalog].find(o => o.url==url)
    if (r==null){
        return default_
    } else {
        return r
    }
}

export function getObjectById(catalog,id,default_=null) {
    var r=useStore()[catalog].find(o => o.id==id)
    if (r==null){
        return default_
    } else {
        return r
    }
}
//Dv Value (for options catalogs)
export function getObjectByValue(catalog,v,default_=null) {
    var r=useStore()[catalog].find(o => o.value==v)
    if (r==null){
        return default_
    } else {
        return r
    }
}
export function getObjectPropertyByValue(catalog,v,property,default_=null) {
    var r=getObjectByValue(catalog,v)
    if (r==null){
        return default_
    } else {
        return r[property]
    }
}

export function getObjectPropertyByUrl(catalog,url,property,default_=null){
    var r=getObjectByUrl(catalog,url)
    if (r==null){
        return default_
    } else {
        return r[property]
    }
}

export function getObjectPropertyById(catalog,id,property,default_=null) {
    var r=getObjectById(catalog,id)
    if (r==null){
        return default_
    } else {
        return r[property]
    }
}