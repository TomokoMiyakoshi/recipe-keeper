import { initRecipeSearch } from "./filterRecipes.js";
import { initNewRecipeForm } from "./newRecipe.js";

const toggleMenu = function() {
    document.querySelector(".menu").classList.toggle("hide");
}
document.querySelector(".menu-btn").addEventListener("click", toggleMenu);


// initialise local storage elements
// if no recipes item exists, no tags array exist either
const initLocalStorage = function() {
    const recipes = localStorage.getItem("recipes");
    if (recipes === null) {
        localStorage.setItem("recipes", JSON.stringify([]));
        localStorage.setItem("tags", JSON.stringify([]));
    }
}

initLocalStorage();


if (document.title == "Chef's Helper") {
   initRecipeSearch();
}

if (document.title == "New Recipe") {
    initNewRecipeForm();
}


const recipesData = [
    {
        name: "Recipe1", favourites: false, recents: false, servingSize: 4, 
        lastAccessed: null,
        tags: ["dinner", "stew"],
        ingredients: ["100g spinach", "1 can tomatoes", "1 tsp paprika"], 
        instructions: ["wash spinach", "open tomato can", "add paprika"]
    }, 
    {
        name: "Recipe2", favourites: false, recents: false, servingSize: 4, 
        lastAccessed: null,
        tags: ["dinner", "curry"],
        ingredients: ["200g brocolli", "2 can beans", "2 tsp curry powder"], 
        instructions: ["wash brocolli", "open beans can", "add curry powder"]
    }, 
    {
        name: "recipe3", favourites: true, recents: false, servingSize: 4, 
        lastAccessed: null,
        tags: ["brunch", "quick"],
        ingredients: ["100g spinach", "1 can beans", "3 tsp paprika"], 
        instructions: ["wash spinach", "open bean can", "add paprika"]
    }
];

const tags = ["dinner", "lunch", "brunch", "quick", "curry", "stew"];
// localStorage.setItem("recipes", JSON.stringify(recipesData));
// localStorage.setItem("tags", JSON.stringify(tags));



