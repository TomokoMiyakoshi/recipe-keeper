import { populateWithTags, addTagElement, removeTagElement, clearTagFormControl } from "./tags.js";
import { getCurrentRecipe, getExistingRecipeName } from "./openRecipe.js";

export const initNewRecipeForm = function() {
    const recipeTags = [];

    document.querySelector(".add-tag-btn").addEventListener("click", function(e){
        e.preventDefault();
        addTag(recipeTags);
    });
    document.querySelector(".submit-recipe-btn").addEventListener("click", function(e) {
        e.preventDefault();
        submitRecipe(recipeTags, e)
    });
    document.querySelector("#file-input").addEventListener("change", function() {
        handleImgFile(this.files[0]);
    });
    document.querySelector(".remove-img-btn").addEventListener("click", removeImage);

    const droparea = document.querySelector(".img-drop-area");
    droparea.addEventListener("dragenter", dragenter, false);
    droparea.addEventListener("dragover", dragover, false);
    droparea.addEventListener("drop", drop, false);

    populateWithTags("#existing-tags");

    // if there is no query string, it is a new recipe, otherwise user is editing existing recipe
    if (window.location.search != "") {
        fillExistingDetails();
    }
}

const fillExistingDetails = async function() {
    const recipe = await getCurrentRecipe();
    document.querySelector("#name").value = recipe.name;
    document.querySelector("#servings").value = recipe.servings;
    document.querySelector("#ingredients").value = recipe.ingredients.join("\n");
    document.querySelector("#instructions").value = recipe.instructions.join("\n");

    // set image preview to existing image
    const img = document.createElement("img");
    img.src = recipe.image;
    showImagePreview(img);

    recipe.tags.forEach(t => addTagElement(t, ".tags-container"));
}

const submitRecipe = async function(recipeTags) {
    const recipe = createRecipeObject(recipeTags);
    await saveRecipe(recipe);
    updateTagsArray(recipeTags);
    redirectToHomePage();
}

const createRecipeObject = function(tags) {
    const form = document.querySelector(".new-recipe-form");
    const name = form.querySelector("#name").value.toLowerCase();
    const favourite = false;
    const lastAccessed = null;
    const servings = form.querySelector("#servings").value;
    const ingredients = form.querySelector("#ingredients").value.split("\n");
    const instructions = form.querySelector("#instructions").value.split("\n");
    const image = form.querySelector("img").src;
    return {name, favourite, lastAccessed, servings, ingredients, instructions, tags, image};
}

const saveRecipe = async function(recipe) {
    const recipes = await localforage.getItem("recipes") || [];
    // replace current recipe with updated recipe if editing
    const existingRecipe = await getExistingRecipeName();
    if (existingRecipe) {
        const existingIndex = recipes.findIndex(r => r.name === existingRecipe);
        recipes[existingIndex] = recipe;
    } else {
        recipes.push(recipe);
    }
    await localforage.setItem("recipes", recipes);
}

const updateTagsArray = async function(recipeTags) {
    const existingTags = await localforage.getItem("tags") || [];
    const updatedTagsArr = existingTags.concat(recipeTags.filter(t => !existingTags.includes(t)));
    localforage.setItem("tags", updatedTagsArr);
}


const redirectToHomePage = function() {
    window.location.href = "index.html";
}

const addTag = function(recipeTags) {
    const input = document.querySelector("#tag");
    const value = input.value.toLowerCase().trim();

    // if tag is not already selected for the recipe, add it to recipeTags
    if (value !== "" && !recipeTags.includes(value)) {
        recipeTags.push(value);
        const deleteBtn = addTagElement(value, ".tags-container");
        deleteBtn.addEventListener("click", function() {
            removeTagElement(this, ".tags-container");
            removeTagFromArray(value, recipeTags);

        });
    }
    clearTagFormControl("#tag");
}

const removeTagFromArray = function(value, recipeTags) {
    const index = recipeTags.indexOf(value);
    recipeTags.splice(index, 1);
};

const handleImgFile = function(file) {
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.addEventListener("load", function(e) {
        img.src = e.target.result;
    })
    reader.readAsDataURL(file);

    showImagePreview();
}

const showImagePreview = function(img) {
    document.querySelector(".img-preview-wrapper").appendChild(img);

    // hide label and disable input
    document.querySelector("#file-input").disabled = true;
    document.querySelector(".img-drop-area label").classList.toggle("hide");
    document.querySelector(".img-preview-wrapper").classList.toggle("hide");
}

const removeImage = function(e) {
    e.preventDefault();
    
    //remove img element
    const img = document.querySelector(".img-preview-wrapper img");
    document.querySelector(".img-preview-wrapper").removeChild(img);
    
    // show label and enable input
    document.querySelector("#file-input").disabled = false;
    document.querySelector(".img-drop-area label").classList.toggle("hide");
    document.querySelector(".img-preview-wrapper").classList.toggle("hide");
}

const dragover = function(e) {
    e.stopPropagation();
    e.preventDefault();
}

const dragenter = dragover;

const drop = function(e) {
    e.stopPropagation();
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImgFile(file);
}
