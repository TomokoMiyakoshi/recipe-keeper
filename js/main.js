import { initRecipeSearch } from "./filterRecipes.js";
import { initNewRecipeForm } from "./newRecipe.js";
import { displaySelectedRecipe } from "./openRecipe.js";
import { initGroceryList } from "./groceryList.js";

const toggleMenu = function() {
    document.querySelector(".menu").classList.toggle("hide");
}
document.querySelector(".menu-btn").addEventListener("click", toggleMenu);

if (document.title == "Chef's Helper") {
   initRecipeSearch();
}

if (document.title == "New Recipe") {
    initNewRecipeForm();
}

if (window.location.pathname === "/open-recipe.html") {
    displaySelectedRecipe();
}

if (window.location.pathname === "/grocery-list.html") {
    initGroceryList();
}

