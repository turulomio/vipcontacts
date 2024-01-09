

export function login_test_User(cy){
    cy.visit('http://127.0.0.1:8003/vipcontacts/')
    cy.contains("Log in").click()
    cy.getDataTest("BtnLogIn_User").type("test")
    cy.getDataTest("BtnLogIn_Password").type("test")
    cy.getDataTest('BtnLogIn_cmd').click()
}

export function add_person_from_Home(cy,name,surname,surname2){
        // Add new person
        cy.getDataTest('MyMenuInline_Button').last().click()
        cy.getDataTest('MyMenuInline_Header0_Item0').click()
        cy.getDataTest('PersonCRUD_Name').type(name)
        cy.getDataTest('PersonCRUD_Surname').type(surname)
        cy.getDataTest('PersonCRUD_Surname2').type(surname2)
        cy.getDataTest('PersonCRUD_Button').click()
    
}