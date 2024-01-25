import { 
  login_test_User,
  add_person_from_Home,
  delete_person_from_Home
} from "./commons"

describe('e2e PersonViewBlob', () => {
  it('Person View Blob', () => {    

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
      cy.getDataTest(`PersonView_TabMedia`).click()


    // cy.getDataTest(`TableBlob_Add`).click()

    
    //cy.getDataTest('TableBlob_CRUD_File').selectFile('cypress/fixtures/turulomio.png') No pude
  
    //   cy.getDataTest(`TableBlob_Add`).click()
    //   cy.getDataTest(`TableBlob_Name`).type("Rockers")
    //   cy.intercept('POST', '/api/blob/').as("post_blob")
    //   cy.getDataTest(`TableBlob_Button`).click()

    //   cy.wait('@post_blob').then((interception)=>{
    //     console.log(interception.response.body)
    //     var blob_id=interception.response.body.id
    //     console.log("Blob", blob_id)
    //     //Update
    //     cy.getDataTest(`TableBlob_ButtonEdit${blob_id}`).click()
    //     cy.getDataTest(`TableBlob_Name`).type(" modified")
    //     cy.getDataTest(`TableBlob_Button`).click()
    //     //Delete
    //     cy.getDataTest(`TableBlob_ButtonDelete${blob_id}`).click()
        //Return to home
        cy.getDataTest(`PersonView_ButtonClose`).click()
        delete_person_from_Home(cy,person_id)

    })
  })
})