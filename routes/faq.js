const express = require("express");
const router = express.Router();
const FAQ = require("../models/faq");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.use(apiLimiter);

// Validation middleware
const validateFAQ = [body("question").notEmpty().trim().escape(), body("answer").notEmpty()];

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faqs = await FAQ.find();
    const translatedFaqs = await Promise.all(
      faqs.map(async (faq) => {
        const cachedFaq = await req.redisClient.getAsync(`faq:${faq._id}:${lang}`);
        if (cachedFaq) {
          return JSON.parse(cachedFaq);
        }
        const translation = await faq.getTranslation(lang);
        await req.redisClient.setAsync(`faq:${faq._id}:${lang}`, JSON.stringify(translation), "EX", 3600);
        return translation;
      })
    );
    res.json(translatedFaqs);
  } catch (err) {
    logger.error("Error fetching FAQs:", err);
    res.status(500).json({ message: "Error fetching FAQs" });
  }
});

// Get a single FAQ
router.get("/:id", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    const translation = await faq.getTranslation(lang);
    res.json(translation);
  } catch (err) {
    logger.error("Error fetching FAQ:", err);
    res.status(500).json({ message: "Error fetching FAQ" });
  }
});

// Create a new FAQ
router.post("/", auth, validateFAQ, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const faq = new FAQ({
    question: req.body.question,
    answer: req.body.answer,
  });

  try {
    const newFaq = await faq.save();
    logger.info("New FAQ created:", newFaq._id);
    res.status(201).json(newFaq);
  } catch (err) {
    logger.error("Error creating FAQ:", err);
    res.status(400).json({ message: "Error creating FAQ" });
  }
});

// Update an FAQ
router.put("/:id", auth, validateFAQ, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    faq.question = req.body.question;
    faq.answer = req.body.answer;
    faq.translations.clear(); // Clear existing translations

    const updatedFaq = await faq.save();
    logger.info("FAQ updated:", updatedFaq._id);
    res.json(updatedFaq);
  } catch (err) {
    logger.error("Error updating FAQ:", err);
    res.status(400).json({ message: "Error updating FAQ" });
  }
});

// Delete an FAQ
router.delete("/:id", auth, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    await faq.remove();
    logger.info("FAQ deleted:", req.params.id);
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    logger.error("Error deleting FAQ:", err);
    res.status(500).json({ message: "Error deleting FAQ" });
  }
});

module.exports = router;