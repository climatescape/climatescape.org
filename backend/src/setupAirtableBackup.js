const { sequelize, Sequelize } = require("./pg")

class AirtableOrganization extends Sequelize.Model {}
AirtableOrganization.init(
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    fields: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "airtable_organization",
    paranoid: true, // Never delete records, only mark as deleted.
  }
)
async function setupAirtableBackup() {
  await AirtableOrganization.sync()
  return AirtableOrganization
}

module.exports = setupAirtableBackup
