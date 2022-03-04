const supertest = require("supertest");
const should = require("should");

const server = supertest.agent("http://localhost:3000");
server.timeout(1500);

const responsefromRecipeGet = {"recipeNames":["scrambledEggs","garlicPasta","chai"]}
const addNew = {"name": "butteredBagel","ingredients": ["1 bagel","butter"],"instructions": ["cut the bagel","spread butter on bagel"]}

describe("Testing server", () => {
    it("should return recipes names", (done) => {
        server
            .get("/recipes")
            .expect(200, responsefromRecipeGet, done)
    });
    it("should create a new collection of one recipe", (done) => {
        server
            .post("/recipes")
            .send(addNew)
            .expect(201, "", done)
    });
    it("should return 404", (done) => {
        server
            .get("/fake")
            .expect(404)
            .end((err, res) => {
                if (err) return done('show error: '+err);
                done();
            });
    });
});