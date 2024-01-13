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
      cy.getDataTest(`PersonView_TabGroups`).click()
      
      cy.getDataTest(`TableGroup_Add`).click()
      cy.getDataTest(`TableGroup_Name`).type("Rockers")
      cy.intercept('POST', '/api/group/').as("post_group")
      cy.getDataTest(`TableGroup_Button`).click()

      cy.wait('@post_group').then((interception)=>{
        console.log(interception.response.body)
        var group_id=interception.response.body.id
        console.log("Group", group_id)
        //Update
        cy.getDataTest(`TableGroup_ButtonEdit${group_id}`).click()
        cy.getDataTest(`TableGroup_Name`).type(" modified")
        cy.getDataTest(`TableGroup_Button`).click()
        //Delete
        cy.getDataTest(`TableGroup_ButtonDelete${group_id}`).click()
        //Return to home
        cy.getDataTest(`PersonView_ButtonClose`).click()
        delete_person_from_Home(cy,person_id)


      })
    })
  })
})