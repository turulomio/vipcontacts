export function empty_person(){
    return {
        name: "",
        surname: "",
        surname2: "",      
        birth: null,
        death: null,
        gender: 0,
    }
}


export function empty_persons_merge(){
    return {
        from: null,
        to: null,
    }
}

export function empty_blob(){
    return {
        dt_update: new Date(),
        dt_obsolete: null,
        person: null,
        name: null,
        mime: null,
        blob: null, //base64 string
        photocontact: false,
    }
}