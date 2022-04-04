// TODO: replace saveifnewtag and unsaveifnewtag with saving into newTags array and merging on submit
import { populateWithTags, addTagElement, removeTagElement, clearTagFormControl } from "./tags.js";

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
    recipes.push(recipe);
    return localforage.setItem("recipes", recipes);
}

const updateTagsArray = async function(recipeTags) {
    const existingTags = await localforage.getItem("tags") || [];
    const updatedTagsArr = existingTags.concat(recipeTags.filter(t => !existingTags.includes(t)));
    return localforage.setItem("tags", updatedTagsArr);
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
