import { login_test_User,add_person_from_Home } from "./commons"
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
      cy.getDataTest(`PersonView_TabMails`).click()
      cy.getDataTest(`TableCrudMail_Add`).click()
      cy.getDataTest(`PersonMailCRUD_Mail`).type("elvis@presley.com")
      cy.getDataTest(`PersonMailCRUD_Button`).click()


      
      


      
    })

    
  })

  
})