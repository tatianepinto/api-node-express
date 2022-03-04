const supertest = require("supertest");
const should = require("should");

const server = supertest.agent("http://localhost:3000");
server.timeout(1500);

const responsefromRecipeGet = {"recipeNames":["scrambledEggs","garlicPasta","chai"]}
const addNew = {"name": "butteredBagel","ingredients": ["1 bagel","butter"],"instructions": ["cut the bagel","spread butter on bagel"]}
const ingredientsFromRecipe = {"details":{"ingredients":["500mL water","100g spaghetti","25mL olive oil","4 cloves garlic","Salt"],"numSteps":5}}

describe("Testing server", () => {
    it("should return recipes names", (done) => {
        server
            .get("/recipes")
            .expect(200, responsefromRecipeGet, done);
    });
    it("should return specific recipe", (done) => {
        server
            .get("/recipes/details/garlicPasta")
            .expect(200, ingredientsFromRecipe, done);
    });
    it("should return {} if doent find details specific recipe", (done) => {
        server
            .get("/recipes/details/pasta")
            .expect(200, "{}", done);
    });
    it("should create a new collection of one recipe", (done) => {
        server
            .post("/recipes")
            .send(addNew)
            .end((err, res) => {
                if(err) return done(err);
                if(res.status === 201){
                    res.status.should.equal(201);
                    res.text.should.be.equal("");
                } else if(res.status === 400){
                    res.status.should.equal(400);
                    res.text.should.be.equal('{"error":"Recipe already exists"}');
                }
                done();
            });
    });
    it("should delete a new collection from recipes", (done) => {
        server
            .put("/recipes")
            .send(addNew)
            .end((err, res) => {
                if(err) return done(err);
                if(res.status === 204){
                    res.status.should.equal(204);
                    res.text.should.be.equal("");
                } else if(res.status === 404) {
                    res.status.should.equal(404);
                    res.text.should.be.equal('{"error": "Recipe does not exist"}');
                }
                done();
            });
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