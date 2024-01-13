import { login_test_User } from "./commons"
describe('e2e Groups', () => {
  it('Groups', () => {    

    login_test_User(cy)

    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralGroup').click()
    cy.getDataTest('LateralMembers').click()
    
  })

  
})