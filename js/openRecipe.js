import { addTagElement } from "./tags.js"
import { updateListFromRecipe } from "./groceryList.js"

export const openSelectedRecipe = async function(e) {
    e.preventDefault();
    await saveSelectedRecipeName(this);
    redirectToRecipePage();
};

const saveSelectedRecipeName = async function(recipeCardLink) {
    const recipeName = recipeCardLink.querySelector("figcaption").innerText;
    const recipes = await localforage.getItem("recipes")
    const recipe = recipes.filter(r => r.name.toLowerCase() == recipeName.toLowerCase());
    await localforage.setItem("open-recipe", recipe);
};

const redirectToRecipePage = function() {
    window.location.href = "open-recipe.html";
};

export const displaySelectedRecipe = async function() {
    document.querySelector(".select-btn").addEventListener("click", selectOrUnselectIngredients);
    document.querySelector(".add-btn").addEventListener("click", updateListFromRecipe);
    document.querySelector(".edit-btn").addEventListener("click", openEditRecipe);

    const recipe = await localforage.getItem("open-recipe");
    document.querySelector(".open-recipe .details-container h1").innerText = recipe[0].name;
    document.querySelector(".open-recipe .details-container h2").innerText = recipe[0].servings + " servings";
    document.querySelector("img").src = recipe[0].image;
    const tags = recipe[0].tags;
    tags.forEach(t => {
        addTagElement(t, ".tags-container", false);
    })
    const ing = document.querySelector(".ing-container ul");
    const ins = document.querySelector(".ins-container ol");

    recipe[0].ingredients.forEach(i => {
        
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

    recipe[0].instructions.forEach(i => {
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
