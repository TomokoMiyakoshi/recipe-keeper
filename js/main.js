import { initRecipeSearch } from "./filterRecipes.js";
import { initNewRecipeForm } from "./newOrEditRecipe.js";
import { displaySelectedRecipe, getCurrentRecipe, updateLastAccessed} from "./openRecipe.js";
import { initGroceryList } from "./groceryList.js";
import { displayIntroCard } from "./displayRecipes.js";


const toggleMenu = function() {
    document.querySelector(".menu").classList.toggle("hide");
}

document.querySelector(".menu-btn").addEventListener("click", toggleMenu);

const recipesExist = async function() {
    const recipes = await localforage.getItem("recipes") || [];
    return recipes.length > 0;
}

if (window.location.pathname === "/index.html" || window.location.pathname =="/") {
    if (await recipesExist()) {
        initRecipeSearch();
    } else {
        displayIntroCard();
    }
} else if (window.location.pathname === "/new-recipe.html") {
    initNewRecipeForm();
} else if (window.location.pathname === "/open-recipe.html") {
    const recipe = await getCurrentRecipe();
    displaySelectedRecipe(recipe);
    updateLastAccessed(recipe);
} else if (window.location.pathname === "/grocery-list.html") {
    initGroceryList();
}



