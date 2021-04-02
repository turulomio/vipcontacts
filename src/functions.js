import moment from 'moment';
import axios from 'axios'

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
