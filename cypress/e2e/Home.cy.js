import { login_test_User,add_person_from_Home } from "./commons"
describe('e2e Home', () => {
  it('Home List', () => {    

    login_test_User(cy)


    // Add new person
    add_person_from_Home(cy,"Elvis","Presley","The King")
    cy.getDataTest('Home_Search').type("Elvis")
    cy.getDataTest('Home_Button').click()


    // Last edited
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralContacts').click()
    cy.getDataTest('LateralLastEdited').click()
    
  })

  
})