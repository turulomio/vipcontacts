import { login_test_User } from "./commons"
describe('e2e Home', () => {
  it('Home List', () => {    

    login_test_User(cy)


    // Add new person
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('PersonCRUD_Name').type("Elvis")
    cy.getDataTest('PersonCRUD_Surname').type("Presley")
    cy.getDataTest('PersonCRUD_Surname2').type("The King")
    cy.getDataTest('PersonCRUD_Button').click()
    cy.getDataTest('Home_Search').type("Elvis")
    cy.getDataTest('Home_Button').click()


    // Last edited
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralContacts').click()
    cy.getDataTest('LateralLastEdited').click()
    
  })

  
})