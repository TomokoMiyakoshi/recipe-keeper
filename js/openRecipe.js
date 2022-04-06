import { addTagElement } from "./tags.js"

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
    document.querySelector(".open-recipe .details-container h1").innerText = recipe[0].name;
    document.querySelector(".open-recipe .details-container h2").innerText = recipe[0].servings + " servings";
    document.querySelector("img").src = recipe[0].image;
    const tags = recipe[0].tags;
    tags.forEach(t => {
        addTagElement(t, ".tags-container", false);
    })
    const ing = document.querySelector(".ing-container ul");
    const ins = document.querySelector(".ins-container ol");
    // ing.innerText = recipe[0].ingredients.join("\r\n");
    // ins.innerText = recipe[0].instructions.join("\r\n");


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
