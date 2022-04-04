export const openSelectedRecipe = function(e) {
    e.preventDefault();
    saveSelectedRecipeName(this);
    redirectToRecipePage();
    displaySelectedRecipe();
};

const saveSelectedRecipeName = function(aElem) {
    const recipe = aElem.querySelector("figcaption").innerText;
    localStorage.setItem("open-recipe", recipe);
};

const redirectToRecipePage = function() {
    window.location.href = "open-recipe.html";
};

const displaySelectedRecipe = function() {
    localStorage.setItem("a-recipe", "A");
    console.log("display selected recipe")
};

