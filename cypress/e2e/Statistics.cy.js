import { login_test_User } from "./commons"
describe('e2e Statistics', () => {
  it('Statistics', () => {    

    login_test_User(cy)

    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralHelpGroup').click()
    cy.getDataTest('LateralStatistics').click()

    
  })

  
})