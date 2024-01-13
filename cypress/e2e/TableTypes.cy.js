import { login_test_User } from "./commons"

describe('e2e Table types', () => {
  it('Table types', () => {    

    login_test_User(cy)

    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralSettingsGroup').click()
    cy.getDataTest('LateralTypes').click()

    cy.getDataTest('TableTypes_Table').click().type("{downArrow}{enter}")

    
  })

  
})