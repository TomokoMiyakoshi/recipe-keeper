import { addTagElement, removeTagElement } from "./tags.js"
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

    const recipe = await localforage.getItem("open-recipe");
    document.querySelector("h1").innerText = recipe[0].name;
    document.querySelector("h2").innerText = recipe[0].servings + " servings";
    document.querySelector("img").src = recipe[0].image;
    const tags = recipe[0].tags;
    tags.forEach(t => {
        addTagElement(t, ".tags-container", false);
    })
    const ing = document.querySelector(".ing-text");
    const ins = document.querySelector(".ins-text");
    ing.innerText = recipe[0].ingredients.join("\r\n");
    ins.innerText = recipe[0].instructions.join("\r\n");
    // show ingredients by default
    ins.style.display = "none";

    document.querySelector(".ing-btn").addEventListener("click", () => {
        ins.style.display = "none";
        ing.style.display = "block";
    })

    document.querySelector(".ins-btn").addEventListener("click", () => {
        ing.style.display = "none";
        ins.style.display = "block";
    })
    
};


// const getRecipeText(ingOrIns) {
//     output = arr.join("\r\n");
//     recipe[0].ingredients.forEach(i => output += )
// }
