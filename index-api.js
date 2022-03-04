let express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const PORT = 3000;

const fs = require('fs'); 

app.use(cors());
app.use("/", router);

//To Get info from body instead of params.
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const data = require("./data.json");

router.route("/recipes")
    .get((req, res) => {
        const result = { "recipeNames": data.recipes.map(({ name }) => name) };
        res.json(result);
    })
    .post((req, res) => {
        const newRecipe = req.body;
        console.log(newRecipe, " - POST recipe");

        const index = data.recipes.findIndex(recipeUnit => recipeUnit.name === newRecipe.name);

        if(index === -1){
            data.recipes.push(newRecipe);
            rewriteDataFile();
            res.status(201).send('');
        } else res.status(400).send({ error: "Recipe already exists" });

        console.log(data, " - newData");
    })
    .put((req, res) => {
        const recipeFromBody = req.body;
        const index = data.recipes.findIndex(recipeUnit => recipeUnit.name === recipeFromBody.name);
        if(index !== -1) {
            data.recipes.splice(index, 1);
            rewriteDataFile();
            res.status(204).send('');
        } else res.status(404).send({ error: "Recipe does not exist" });
        console.log(data, " - PUT data");
    });

router.route("/recipes/details/:name").get((req, res) => {
    const recipeName = req.params.name;
    const recipe = data.recipes.find(({ name }) => (name === recipeName));
    console.log(recipe, " - recipe");
    const result = () => {
        if (recipe !== undefined) {
            const ingredients = recipe.ingredients;
            console.log(ingredients);
            return { "details": { ingredients, "numSteps": ingredients.length } }
        } else return {};
    };
    res.json(result());
});

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});

const rewriteDataFile = () => {
    try {
        fs.writeFileSync("./data.json", JSON.stringify(data));
        //file written successfully
    } catch (err) {
        console.error(err);
    }
}
