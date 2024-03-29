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
      cy.getDataTest(`PersonView_TabMails`).click()
      cy.getDataTest(`TableMail_Add`).click()
      cy.getDataTest(`PersonMailCRUD_Mail`).type("elvis@presley.com")
      cy.intercept('POST', '/api/mail/').as("post_mail")
      cy.getDataTest(`PersonMailCRUD_Button`).click()

      cy.wait('@post_mail').then((interception)=>{
        console.log(interception.response.body)
        var mail_id=interception.response.body.id
        console.log("Mail", mail_id)
        //Set obsolete
        cy.getDataTest(`TableMail_ButtonObsolete${mail_id}`).click()
        cy.wait(300)
        cy.getDataTest(`TableMail_ButtonObsolete`).click()
        cy.wait(300)
        cy.getDataTest(`TableMail_ButtonObsolete${mail_id}`).click()
        cy.wait(300)

        //Update
        cy.getDataTest(`TableMail_ButtonEdit${mail_id}`).click()
        cy.getDataTest(`PersonMailCRUD_Mail`).type(".edited.com")
        cy.getDataTest(`PersonMailCRUD_Button`).click()
        //Delete
        cy.getDataTest(`TableMail_ButtonDelete${mail_id}`).click()
        cy.getDataTest(`PersonMailCRUD_Button`).click()
        //Return to home
        cy.getDataTest(`PersonView_ButtonClose`).click()
        delete_person_from_Home(cy,person_id)


      })
    })
  })
})