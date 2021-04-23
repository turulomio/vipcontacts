import moment from 'moment';
import axios from 'axios'


export function age(birth_iso_string) {
    //The magic number: 31557600000 is 24 * 3600 * 365.25 * 1000 
    // ~~ Math.floor
    var birth = +new Date(birth_iso_string);
    return ~~((new Date() - birth ) / (31557600000));
}


export function fullName(person){
    return `${person.name} ${person.surname} ${person.surname2}`
}

export function localtime(value){
    if (value){
        var dateFormat = 'YYYY-MM-DD HH:mm:ss';
        var testDateUtc = moment.utc(value);
        var localDate = testDateUtc.local();
        return (localDate.format(dateFormat)); // 2015-30-01 02:00:00
    }
    console.log("REALLY");
    return null;
}   

export function moment_day_start(isostring){
    if (isostring){
        var testDateUtc = moment.utc(isostring);
        var localDate = testDateUtc.local();
        return localDate
    }
    console.log("REALLY");
    return null;
}   


export function AddressTypeName(value){
    var retypes=this.$store.state.catalogs.addresstype.find(t => t.value==value);
    return retypes.display_name;
}

export function CountryName(value){
    var retypes=this.$store.state.catalogs.countries.find(t => t.value==value);
    return retypes.display_name;
}

export function MailTypeName(value){
    var retypes=this.$store.state.catalogs.mailtype.find(t => t.value==value);
    return retypes.display_name;
}

export function LogTypeName(value){
    var retypes=this.$store.state.catalogs.logtype.find(t => t.value==value);
    return retypes.display_name;
}

export function PhoneTypeName(value){
    var retypes=this.$store.state.catalogs.phonetype.find(t => t.value==value);
    return retypes.display_name;
}

export function RelationshipTypeName(value){
    var retypes=this.$store.state.catalogs.relationshiptype.find(t => t.value==value);
    return retypes.display_name;
}

export function myheaders(){
    return {
        'Authorization': `Token ${this.$store.state.token}`,
        'Accept-Language': `${this.$i18n.locale}-${this.$i18n.locale}`,
        'Content-Type':'application/json'
    }
}

export function vuex_update_catalogs(){   
    axios.options(`${this.$store.state.apiroot}/api/persons/`, { headers: this.myheaders() })
    .then((response) => {
        this.$store.state.catalogs.persongender= sortObjectsArray(response.data.actions.POST.gender.choices, "display_name")
        this.$store.state.catalogs.countries= sortObjectsArray(response.data.actions.POST.address.child.children.country.choices, "display_name")
        this.$store.state.catalogs.addresstype= sortObjectsArray(response.data.actions.POST.address.child.children.retypes.choices, "display_name")
        this.$store.state.catalogs.mailtype= sortObjectsArray(response.data.actions.POST.mail.child.children.retypes.choices, "display_name")
        this.$store.state.catalogs.phonetype= sortObjectsArray(response.data.actions.POST.phone.child.children.retypes.choices, "display_name")
        this.$store.state.catalogs.logtype= sortObjectsArray(response.data.actions.POST.log.child.children.retypes.choices, "display_name")
        this.$store.state.catalogs.relationshiptype=sortObjectsArray(response.data.actions.POST.relationship.child.children.retypes.choices, "display_name")
        console.log(this.$store.state.catalogs.relationshiptype)
        console.log("Updated catalogs")
        console.log(this.$store.state)
        return
    }, (error) => {
        console.log(error);
    });
}

export function logout(){
    const formData = new FormData();
    formData.append('key', this.$store.state.token);
    axios.post(`${this.$store.state.apiroot}/logout/`, formData)
    .then((response) => {
        console.log(response.data);
        this.$store.state.token=null;
        this.$store.state.logged=false;
    }, (error) => {
        console.log(error);
        });
}

/*
export function person_search_string(person){
    function nn(s){
        if (s==null){
            return "";
        }
        return s;
        
    }
    console.log(person);
    var s=`${nn(person.name)} ${nn(person.surname)} ${nn(person.surname2)} ${nn(person.birth)} ${nn(person.death)}`;
    person.mail.forEach( o => s=s+ " " + nn(o.mail));
    person.phone.forEach( o => s=s+ " " + nn(o.phone));
    person.alias.forEach( o => s=s+ " " + nn(o.name));
    person.address.forEach( o => s=s+ " " + nn(o.address) + " " + nn(o.city));
    person.log.forEach( o => s=s+ " "  + nn(o.text));
    return s
    
}*/

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
