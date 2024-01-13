import { 
  login_test_User,
  add_person_from_Home,
  delete_person_from_Home
} from "./commons"

describe('e2e Home', () => {
  it('Home List', () => {    

    login_test_User(cy)


    // Add person
    cy.intercept('POST', '/api/person/').as("post_person")
    add_person_from_Home(cy,"Elvis","Presley","The King")
    cy.getDataTest('Home_Search').type("Elvis")
    cy.getDataTest('Home_Button').click()
    cy.wait('@post_person').then((interception)=>{
      var person_id=interception.response.body.id
      console.log("Person clicked", person_id)
      cy.getDataTest(`TablePersons_Item${person_id}`).click()
      cy.getDataTest(`PersonView_TabPhones`).click()
      
      cy.getDataTest(`TablePhone_Add`).click()
      cy.getDataTest(`PersonPhoneCRUD_Phonetype`).type("Home{downArrow}{enter}")
      cy.getDataTest(`PersonPhoneCRUD_Phone`).type("656565655")
      cy.intercept('POST', '/api/phone/').as("post_phone")
      cy.getDataTest(`PersonPhoneCRUD_Button`).click()

      cy.wait('@post_phone').then((interception)=>{
        console.log(interception.response.body)
        var phone_id=interception.response.body.id
        console.log("Phone", phone_id)
        //Update
        cy.getDataTest(`TablePhone_ButtonEdit${phone_id}`).click()
        cy.getDataTest(`PersonPhoneCRUD_Phone`).type("999999999")
        cy.getDataTest(`PersonPhoneCRUD_Button`).click()
        //Delete
        cy.getDataTest(`TablePhone_ButtonDelete${phone_id}`).click()
        cy.getDataTest(`PersonPhoneCRUD_Button`).click()
        //Return to home
        cy.getDataTest(`PersonView_ButtonClose`).click()
        delete_person_from_Home(cy,person_id)


      })
    })
  })
})