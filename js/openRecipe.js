import { addTagElement } from "./tags.js"
import { updateListFromRecipe } from "./groceryList.js"
import { initNewRecipeForm } from "./newRecipe.js";

export const openSelectedRecipe = async function(e) {
    e.preventDefault();
    const recipeName = this.querySelector("figcaption").innerText.toLowerCase();
    redirectToRecipePage(recipeName);
};

const redirectToRecipePage = function(recipeName) {
    window.location.href = "open-recipe.html?recipe=" + recipeName;
};

export const displaySelectedRecipe = async function() {
    document.querySelector(".select-btn").addEventListener("click", selectOrUnselectIngredients);
    document.querySelector(".add-btn").addEventListener("click", updateListFromRecipe);
    document.querySelector(".edit-btn").addEventListener("click", openEditRecipe);
    document.querySelector(".star-btn").addEventListener("click", changeRecipeStar);

   const recipe = await getCurrentRecipe();
    
    document.querySelector(".open-recipe .details-container h1").innerText = recipe.name;
    document.querySelector(".open-recipe .details-container h2").innerText = recipe.servings + " servings";
    document.querySelector("img").src = recipe.image;
    const tags = recipe.tags;
    tags.forEach(t => {
        addTagElement(t, ".tags-container", false);
    })
    const ing = document.querySelector(".ing-container ul");
    const ins = document.querySelector(".ins-container ol");

    recipe.ingredients.forEach(i => {
        
        const check = document.createElement("input");
        check.setAttribute("type", "checkbox");
        check.value = i;
        check.id = i;
        const label = document.createElement("label");
        label.htmlFor = i;
        label.appendChild(document.createTextNode(i));

        const li = document.createElement("li");
        li.appendChild(check);
        li.appendChild(label);
        ing.appendChild(li);
    })

    recipe.instructions.forEach(i => {
        const li = document.createElement("li");
        li.innerText = i;
        ins.appendChild(li);
    })
};

const selectOrUnselectIngredients = function(e) {
    const checkboxes = document.querySelectorAll(".ing-container li input");
    if (e.target.innerText == "Select all") {
        // select all ingredients
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        })
        // change button txt
        e.target.innerText = "Unselect all";
    } else {
        // unselect all ingredients
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        })
        // change button txt
        e.target.innerText = "Select all";
    }
}

export const getExistingRecipeName = function(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("recipe");
}

export const getCurrentRecipe = async function() {
    const recipeName = getExistingRecipeName();
    const recipes = await localforage.getItem("recipes") || [];
    return recipes.find(r => r.name === recipeName);
}


const openEditRecipe = function(e) {
    window.location.href = "new-recipe.html?recipe=" + getExistingRecipeName();
    initNewRecipeForm();
}

const changeRecipeStar = async function(e) {
    e.preventDefault();
    console.log(this.lastElementChild.innerText);
    if (this.lastElementChild.innerText === "Unstar") {
        updateStarValue(false);
        this.lastElementChild.innerText = "Star";
    } else {
        updateStarValue(true);
        this.lastElementChild.innerText = "Unstar";
    }

}

const updateStarValue = async function(newValue) {
    const recipeName = getExistingRecipeName();
    const recipes = await localforage.getItem("recipes");
    const recipeIndex = recipes.findIndex(r => r.name == recipeName);
    recipes[recipeIndex].favourite = newValue;
    await localforage.setItem("recipes", recipes);
}