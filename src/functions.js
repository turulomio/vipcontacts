import vCardsJS from 'vcards-js'


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
