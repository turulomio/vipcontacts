import { login_test_User,add_person_from_Home } from "./commons"
describe('e2e Merge Contacts', () => {
  it('Merge contacts', () => {    
    login_test_User(cy)

    //cy.getDataTest("AppBar_SwitchLanguages").click().type("{downArrow}{enter}")

    // Added persons to merge
    add_person_from_Home(cy,"Elvis","Presley","The King")
    add_person_from_Home(cy,"Eddie","Cochran","Eddie")


    // Merge contacts
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralContacts').click()
    cy.getDataTest('LateralContactsMerge').click()
    cy.getDataTest('PersonsMerge_From').type("Eddie{downArrow}{enter}")
    cy.getDataTest('PersonsMerge_To').type("Elvis{downArrow}{enter}")
    cy.getDataTest('PersonsMerge_Button').click()


    
  })

  
})