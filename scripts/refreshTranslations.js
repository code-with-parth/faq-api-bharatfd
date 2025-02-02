const mongoose = require("mongoose")
const FAQ = require("../models/faq")
const config = require("../config")
const logger = require("../utils/logger")

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("Could not connect to MongoDB", err))

async function refreshTranslations() {
  const languages = ["es", "fr", "de", "it", "ja", "ko", "zh"] // Add more languages as needed

  for (const lang of languages) {
    try {
      await FAQ.bulkTranslate(lang)
      logger.info(`Refreshed translations for ${lang}`)
    } catch (err) {
      logger.error(`Error refreshing translations for ${lang}:`, err)
    }
  }

  mongoose.disconnect()
}

refreshTranslations()

