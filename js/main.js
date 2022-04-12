import { initRecipeSearch } from "./filterRecipes.js";
import { initNewRecipeForm } from "./newOrEditRecipe.js";
import { displaySelectedRecipe, getCurrentRecipe, updateLastAccessed} from "./openRecipe.js";
import { initGroceryList } from "./groceryList.js";


const toggleMenu = function() {
    document.querySelector(".menu").classList.toggle("hide");
}
document.querySelector(".menu-btn").addEventListener("click", toggleMenu);

if (window.location.pathname === "/index.html" || window.location.pathname =="/") {
   initRecipeSearch();
}

if (window.location.pathname === "/new-recipe.html") {
    initNewRecipeForm();
}

if (window.location.pathname === "/open-recipe.html") {
    const recipe = await getCurrentRecipe();
    displaySelectedRecipe(recipe);
    updateLastAccessed(recipe);
}

if (window.location.pathname === "/grocery-list.html") {
    initGroceryList();
}

