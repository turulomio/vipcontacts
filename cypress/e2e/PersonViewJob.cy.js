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
      cy.getDataTest(`PersonView_TabJobs`).click()
      
      cy.getDataTest(`TableJob_Add`).click()
      cy.getDataTest(`TableJob_Profession`).type("Singer")
      cy.getDataTest(`TableJob_Organization`).click({force:true}).type("RnR")
      cy.getDataTest(`TableJob_Department`).click({force:true}).type("RnR deparment")
      cy.getDataTest(`TableJob_Title`).click({force:true}).type("The  king")
      cy.intercept('POST', '/api/job/').as("post_job", {force:true})
      cy.getDataTest(`TableJob_Button`).click({force:true})

      cy.wait('@post_job').then((interception)=>{
        console.log(interception.response.body)
        var job_id=interception.response.body.id
        console.log("Job", job_id)
        //Update
        cy.getDataTest(`TableJob_ButtonEdit${job_id}`).click()
        cy.getDataTest(`TableJob_Profession`).click({force:true}).type("Best Singer")
        cy.getDataTest(`TableJob_Organization`).click({force:true}).type("Best RnR")
        cy.getDataTest(`TableJob_Department`).click({force:true}).type("Best RnR deparment")
        cy.getDataTest(`TableJob_Title`).click({force:true}).type("The best king")
        cy.getDataTest(`TableJob_Button`).click({force:true})
        //Delete
        cy.getDataTest(`TableJob_ButtonDelete${job_id}`).click()
        //Return to home
        cy.getDataTest(`PersonView_ButtonClose`).click()
        delete_person_from_Home(cy,person_id)


      })
    })
  })
})