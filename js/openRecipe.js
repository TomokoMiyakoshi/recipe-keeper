export const openSelectedRecipe = function(e) {
    e.preventDefault();
    saveSelectedRecipeName(this);
    redirectToRecipePage();
};


const saveSelectedRecipeName = function(recipeCardLink) {
    const recipeName = recipeCardLink.querySelector("figcaption").innerText;
    const recipes = JSON.parse(localStorage.getItem("recipes"));
    const recipe = recipes.filter(r => r.name.toLowerCase() == recipeName.toLowerCase());
    localStorage.setItem("open-recipe", JSON.stringify(recipe));
};

const redirectToRecipePage = function() {
    window.location.href = "open-recipe.html";
};

export const displaySelectedRecipe = function() {
    const recipe = JSON.parse(localStorage.getItem("open-recipe"));
    console.log(recipe);
    console.log(document.querySelector("img"));
    document.querySelector("img").src = recipe.image;
    console.log(document.querySelector("img"));
    console.log(recipe.image);
};

// window.onload = displaySelectedRecipe();

