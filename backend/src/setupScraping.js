const { sequelize, Sequelize } = require("./pg")

const setupAirtableBackup = require("./setupAirtableBackup")

class ScrapingResult extends Sequelize.Model {}

async function initScrapingResult() {
  const AirtableOrganization = await setupAirtableBackup()
  ScrapingResult.init(
    {
      orgId: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: AirtableOrganization,
          key: "id",
        },
      },
      requestType: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true,
      },
      // This column is created by sequelize automatically. Declaring it explicitly to include in the primary key.
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        primaryKey: true,
      },
      result: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "scraping_result",
    }
  )
  AirtableOrganization.hasMany(ScrapingResult)
  ScrapingResult.belongsTo(AirtableOrganization, {
    foreignKey: "org_id",
    onDelete: "RESTRICT",
  })
}

async function setupScraping() {
  await initScrapingResult()
  await sequelize.sync()
  return ScrapingResult
}

module.exports = setupScraping
