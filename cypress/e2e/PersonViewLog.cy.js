import { 
  login_test_User,
  add_person_from_Home,
  delete_person_from_Home
} from "./commons"

describe('e2e Person View Log', () => {
  it('Person View Log', () => {    

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
      cy.getDataTest(`PersonView_TabLogs`).click()
      
      cy.getDataTest(`TableLog_Add`).click()
      cy.getDataTest(`TableLog_Text`).type("R'n'R will never die")
      cy.intercept('POST', '/api/log/').as("post_log")
      cy.getDataTest(`TableLog_Button`).click()

      cy.wait('@post_log').then((interception)=>{
        console.log(interception.response.body)
        var log_id=interception.response.body.id
        console.log("Log", log_id)
        //Update
        cy.getDataTest(`TableLog_ButtonEdit${log_id}`).click()
        cy.getDataTest(`TableLog_Text`).type("...")
        cy.getDataTest(`TableLog_Button`).click()
        //Delete
        cy.getDataTest(`TableLog_ButtonDelete${log_id}`).click()
        //Return to home
        cy.getDataTest(`PersonView_ButtonClose`).click()
        delete_person_from_Home(cy,person_id)


      })
    })
  })
})