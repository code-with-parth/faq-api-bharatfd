const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const FAQ = require("../models/faq");
const jwt = require("jsonwebtoken");
const config = require("../config");

chai.use(chaiHttp);
const expect = chai.expect;

describe("FAQ API", () => {
  let authToken;

  before(() => {
    // Create a mock auth token for testing protected routes
    authToken = jwt.sign({ user: { id: "123" } }, config.jwtSecret);
  });

  beforeEach(async () => {
    await FAQ.deleteMany({});
  });

  describe("GET /api/faqs", () => {
    it("should get all FAQs", async () => {
      const faq = new FAQ({ question: "Test Question", answer: "Test Answer" });
      await faq.save();

      const res = await chai.request(app).get("/api/faqs");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.equal(1);
      expect(res.body[0].question).to.equal("Test Question");
    });

    it("should get translated FAQs", function (done) {
      this.timeout(5000); // Increase timeout to 5000ms
      const faq = new FAQ({ question: "Hello", answer: "World" });
      faq.save().then(() => {
        chai
          .request(app)
          .get("/api/faqs?lang=es")
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body.length).to.equal(1);
            expect(res.body[0].question).to.equal("Hola");
            expect(res.body[0].answer).to.equal("Mundo");
            done();
          });
      });
    });
  });

  describe("POST /api/faqs", () => {
    it("should create a new FAQ", async () => {
      const res = await chai
        .request(app)
        .post("/api/faqs")
        .set("x-auth-token", authToken)
        .send({ question: "New Question", answer: "New Answer" });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");
      expect(res.body.question).to.equal("New Question");
      expect(res.body.answer).to.equal("New Answer");
    });

    it("should not create a FAQ without auth token", async () => {
      const res = await chai.request(app).post("/api/faqs").send({ question: "New Question", answer: "New Answer" });

      expect(res).to.have.status(401);
    });

    it("should not create a FAQ with invalid data", async () => {
      const res = await chai
        .request(app)
        .post("/api/faqs")
        .set("x-auth-token", authToken)
        .send({ question: "", answer: "" });

      expect(res).to.have.status(400);
    });
  });

  describe("PUT /api/faqs/:id", () => {
    it("should update an existing FAQ", async () => {
      const faq = new FAQ({ question: "Old Question", answer: "Old Answer" });
      await faq.save();

      const res = await chai
        .request(app)
        .put(`/api/faqs/${faq._id}`)
        .set("x-auth-token", authToken)
        .send({ question: "Updated Question", answer: "Updated Answer" });

      expect(res).to.have.status(200);
      expect(res.body.question).to.equal("Updated Question");
      expect(res.body.answer).to.equal("Updated Answer");
    });
  });

  describe("DELETE /api/faqs/:id", () => {
    it("should delete an existing FAQ", async () => {
      const faq = new FAQ({ question: "To Be Deleted", answer: "Soon" });
      await faq.save();

      const res = await chai.request(app).delete(`/api/faqs/${faq._id}`).set("x-auth-token", authToken);

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal("FAQ deleted");

      const deletedFAQ = await FAQ.findById(faq._id);
      expect(deletedFAQ).to.be.null;
    });
  });
});