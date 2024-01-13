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
      cy.getDataTest(`TableAlias_Add`).click()
      cy.getDataTest(`PersonAliasCRUD_Alias`).type("The king")
      cy.intercept('POST', '/api/alias/').as("post_alias")
      cy.getDataTest(`PersonAliasCRUD_Button`).click()

      cy.wait('@post_alias').then((interception)=>{
        console.log(interception.response.body)
        var alias_id=interception.response.body.id
        console.log("Alias", alias_id)
        //Update
        cy.getDataTest(`TableAlias_ButtonEdit${alias_id}`).click()
        cy.getDataTest(`PersonAliasCRUD_Alias`).type(".edited.com")
        cy.getDataTest(`PersonAliasCRUD_Button`).click()
        //Delete
        cy.getDataTest(`TableAlias_ButtonDelete${alias_id}`).click()
        cy.getDataTest(`PersonAliasCRUD_Button`).click()
        //Return to home
        cy.getDataTest(`PersonView_ButtonClose`).click()
        delete_person_from_Home(cy,person_id)


      })
    })
  })
})