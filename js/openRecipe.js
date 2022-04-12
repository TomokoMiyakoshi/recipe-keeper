import { addTagElement } from "./tags.js"
import { updateListFromRecipe } from "./groceryList.js"
import { initNewRecipeForm } from "./newOrEditRecipe.js";

export const openSelectedRecipe = async function(e) {
    e.preventDefault();
    const recipeName = this.querySelector("figcaption").innerText.toLowerCase();
    redirectToRecipePage(recipeName);
};

const redirectToRecipePage = function(recipeName) {
    window.location.href = "open-recipe.html?recipe=" + recipeName;
};

export const displaySelectedRecipe = async function(recipe) {
    document.querySelector(".select-btn").addEventListener("click", selectOrUnselectIngredients);
    document.querySelector(".add-btn").addEventListener("click", updateListFromRecipe);
    document.querySelector(".edit-btn").addEventListener("click", openEditRecipe);
    document.querySelector(".star-btn").addEventListener("click", changeRecipeStar);
    document.querySelector(".delete-btn").addEventListener("click", deleteRecipe);
    
    document.querySelector(".open-recipe .details-container h1").innerText = recipe.name;
    document.querySelector(".open-recipe .details-container h2").innerText = recipe.servings + " servings";
    document.querySelector("img").src = recipe.image;
    const tags = recipe.tags;
    tags.forEach(t => {
        addTagElement(t, ".tags-container", false);
    })

    const starBtnSpan = document.querySelector(".star-btn span")
    recipe.favourite ? starBtnSpan.innerText = "Unstar" : starBtnSpan.innerText = "Star";
    const ing = document.querySelector(".ing-container ul");
    const ins = document.querySelector(".ins-container ol");

    document.querySelector(".print-btn").addEventListener("click", printWindow);

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

export const updateLastAccessed = async function(recipe) {
    const recipes = await localforage.getItem("recipes");
    const recipeIndex = recipes.findIndex(r => r.name == recipe.name);
    recipes[recipeIndex].lastAccessed = new Date();
    await localforage.setItem("recipes", recipes);
}

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

const openEditRecipe = function() {
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

const deleteRecipe = async function() {
    if (confirm("Are you sure you want to delete this recipe?")) {
        const recipeName = getExistingRecipeName();
        const recipes = await localforage.getItem("recipes");
        const recipeIndex = recipes.findIndex(r => r.name == recipeName);
        recipes.splice(recipeIndex, 1);
        await localforage.setItem("recipes", recipes);
        // redirect to home page
        window.location.href = "index.html";
    }
}

// const deleteUniqueTags = function(recipe, recipes) {
//     recipe.tags.forEach(t => {

//     })
//     const tags = recipes.map(r => r.tags);

// }

// const getTagSet()

const printWindow = function() {
    window.print();
}