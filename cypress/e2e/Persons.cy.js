import { login_test_User } from "./commons"
describe('e2e Home', () => {
  it('Home List', () => {    

    login_test_User(cy)
    //Open lateral menu
    // cy.getDataTest('LateralIcon').click()
    // cy.getDataTest('LateralHome').click()


    // Add new person
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('AccountsoperationsSearch_Search').type("comment")
    cy.getDataTest('AccountsoperationsSearch_Button').click()
    
  })

  
})