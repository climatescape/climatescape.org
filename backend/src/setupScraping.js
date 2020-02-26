const Sequelize = require("sequelize")
const { sequelize } = require("./pg")

class ScrapingResult extends Sequelize.Model {}
ScrapingResult.init(
  {
    orgId: {
      type: Sequelize.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    requestType: {
      type: Sequelize.TEXT,
      allowNull: false,
      primaryKey: true,
    },
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
async function setupScraping() {
  await ScrapingResult.sync()
  return ScrapingResult
}

module.exports = setupScraping
