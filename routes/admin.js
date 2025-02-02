const express = require("express")
const router = express.Router()
const FAQ = require("../models/faq")
const auth = require("../middleware/auth")

// Admin dashboard
router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find()
    res.render("admin/dashboard", { faqs })
  } catch (err) {
    res.status(500).send("Server Error")
  }
})

// Create FAQ form
router.get("/create",(req, res) => {
  res.render("admin/create")
})

// Create FAQ
router.post("/create",  async (req, res) => {
  try {
    const { question, answer } = req.body
    await FAQ.create({ question, answer })
    res.redirect("/admin")
  } catch (err) {
    res.status(500).send("Server Error")
  }
})

module.exports = router

