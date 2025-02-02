const mongoose = require("mongoose");
const translate = require("@vitalets/google-translate-api");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    translations: {
      type: Map,
      of: new mongoose.Schema(
        {
          question: String,
          answer: String,
        },
        { _id: false }
      ),
      default: {},
    },
    lastTranslated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

faqSchema.methods.getTranslation = async function (lang) {
  if (lang === "en") {
    return { question: this.question, answer: this.answer };
  }

  if (this.translations && this.translations.has(lang)) {
    return this.translations.get(lang);
  }

  // Translate if not available
  const questionTranslation = await translate(this.question, { to: lang });
  const answerTranslation = await translate(this.answer, { to: lang });

  const translation = {
    question: questionTranslation.text,
    answer: answerTranslation.text,
  };

  if (!this.translations) {
    this.translations = new Map();
  }

  this.translations.set(lang, translation);
  this.lastTranslated = new Date();
  await this.save();

  return translation;
};

faqSchema.methods.clearTranslations = function () {
  if (!this.translations) {
    this.translations = new Map();
  }
  this.translations.clear();
};

faqSchema.statics.bulkTranslate = async function (lang) {
  const faqs = await this.find({
    $or: [
      { [`translations.${lang}`]: { $exists: false } },
      { lastTranslated: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    ],
  });

  const translationPromises = faqs.map((faq) => faq.getTranslation(lang));
  await Promise.all(translationPromises);
};

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;