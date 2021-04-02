import moment from 'moment';

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
        var type=this.$store.state.catalogs.addresstype.find(type => type.value==value);
        return type.display_name;
    }

    export function CountryName(value){
        var type=this.$store.state.catalogs.countries.find(type => type.value==value);
        return type.display_name;
    }


/*
export class util {
    static localtime(value){
        if (value){
            var dateFormat = 'YYYY-MM-DD HH:mm:ss';
            var testDateUtc = moment.utc(value);
            var localDate = testDateUtc.local();
            return (localDate.format(dateFormat)); // 2015-30-01 02:00:00
        }
        console.log("REALLY");
        return null;
    }      

    static AddressTypeName(value){
        var type=this.$store.state.catalogs.addresstype.find(type => type.value==value);
        return type.display_name;
    }

    static CountryName(value){
        var type=this.$store.state.catalogs.countries.find(type => type.value==value);
        return type.display_name;
    }

}*/
