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
      cy.getDataTest(`PersonView_TabRelationships`).click()
      
      cy.getDataTest(`TableRelationship_Add`).click()
      cy.getDataTest(`TableRelationship_Destiny`).type("Elvis{downArrow}{enter}")
      cy.intercept('POST', '/api/relationship/').as("post_relationship")
      cy.getDataTest(`TableRelationship_Button`).click()

      cy.wait('@post_relationship').then((interception)=>{
        console.log(interception.response.body)
        var relationship_id=interception.response.body.id
        console.log("Relationship", relationship_id)
        //Update
        cy.getDataTest(`TableRelationship_ButtonEdit${relationship_id}`).click()
        cy.getDataTest(`TableRelationship_Destiny`).type("{downArrow}{enter}")
        cy.getDataTest(`TableRelationship_Button`).click()
        //Delete
        cy.getDataTest(`TableRelationship_ButtonDelete${relationship_id}`).click()
        //Return to home
        cy.getDataTest(`PersonView_ButtonClose`).click()
        delete_person_from_Home(cy,person_id)


      })
    })
  })
})