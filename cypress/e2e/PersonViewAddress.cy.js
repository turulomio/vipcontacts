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
      cy.getDataTest(`PersonView_TabAddresses`).click()
      
      cy.getDataTest(`TableAddress_Add`).click()
      cy.getDataTest(`TableAddress_Address`).type("Home")
      cy.getDataTest(`TableAddress_Code`).type("28028")
      cy.getDataTest(`TableAddress_City`).type("Madrid")
      cy.getDataTest(`TableAddress_Country`).clear().type("Spain{downArrow}{enter}")
      cy.intercept('POST', '/api/address/').as("post_address")
      cy.getDataTest(`TableAddress_Button`).click()

      cy.wait('@post_address').then((interception)=>{
        console.log(interception.response.body)
        var address_id=interception.response.body.id
        console.log("Address", address_id)
        //Update
        cy.getDataTest(`TableAddress_ButtonEdit${address_id}`).click()
        cy.getDataTest(`TableAddress_Address`).type("Graceland")
        cy.getDataTest(`TableAddress_Code`).type("99999")
        cy.getDataTest(`TableAddress_City`).type("Memphis")
        cy.getDataTest(`TableAddress_Button`).click()
        //Delete
        cy.getDataTest(`TableAddress_ButtonDelete${address_id}`).click()
        //Return to home
        cy.getDataTest(`PersonView_ButtonClose`).click()
        delete_person_from_Home(cy,person_id)


      })
    })
  })
})