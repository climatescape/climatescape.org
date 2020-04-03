/// <reference types=“cypress” />

function vistOrgs(...viewport) {
  cy.viewport(...viewport).visit("/")
  cy.contains("Atmosphere")
    .should("be.visible")
    .click()
  cy.contains("Aclima").click()
  cy.contains("@aclima")
}

describe("Cypress", function() {
  it("Mobile version", function() {
    vistOrgs("iphone-6")
  })

  it("Desktop version", function() {
    vistOrgs(1024, 768)
  })
})
