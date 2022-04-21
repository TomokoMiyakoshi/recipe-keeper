import {openSelectedRecipe} from "./openRecipe.js";

export const displayRecipes = async function(recipes = undefined) {
    const container = document.querySelector(".recipes-container");
    
    if (recipes === undefined) {
        recipes = await localforage.getItem("recipes") || [];
    } else {
        // clear recipes container before displaying new result
        while(container.lastElementChild) {
            container.removeChild(container.lastElementChild);
        }
    }

    // if no new results, display message
    if (recipes.length === 0) {
        document.querySelector(".no-results-message").style.display = "block";
    } else {
        document.querySelector(".no-results-message").style.display = "none";
    }
    
    // display new results
    recipes.forEach(r => {
        const recipeCard = createRecipeCard(r);
        container.appendChild(recipeCard);
    });
};

export const displayIntroCard = function() {
    document.querySelector(".intro-card").style.display = "block";
    document.querySelector("main").style.display = "none";
    document.querySelector(".intro-card button").addEventListener("click", function() {
        window.location.href = "new-recipe.html";
    })
}
const createRecipeCard = function(recipe) {
    const link = document.createElement("a");
    link.classList.add("recipe-card");
    link.href = "open-recipe.html";
    link.addEventListener("click", openSelectedRecipe);
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = recipe.image;
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = recipe.name;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    link.appendChild(figure);
    return link;
};

