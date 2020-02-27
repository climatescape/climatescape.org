const { sequelize, Sequelize } = require("./pg")

class Organization extends Sequelize.Model {}
Organization.init(
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
    modelName: "organization",
    paranoid: true, // Never delete records, only mark as deleted.
  }
)
async function setupAirtableBackup() {
  await Organization.sync()
  return Organization
}

module.exports = setupAirtableBackup
