import { login_test_User } from "./commons"
describe('e2e Groups', () => {
  it('Groups', () => {    

    login_test_User(cy)

    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralSettingsGroup').click()
    cy.getDataTest('LateralSettings').click()

    cy.getDataTest("Settings_Button").click()
    
  })

  
})