import { populateWithTags, addTagElement, removeTagElement, clearTagFormControl } from "./tags.js";
import { getCurrentRecipe, getExistingRecipeName } from "./openRecipe.js";

export const initNewRecipeForm = async function() {
    const recipeTags = [];
    const existingRecipe = await getCurrentRecipe();
    let existingRecipeName = "";
    if (existingRecipe) {
        existingRecipeName = existingRecipe.name;
    }

    document.querySelector(".add-tag-btn").addEventListener("click", function(e){
        e.preventDefault();
        addTag(recipeTags);
    });

    document.querySelector(".new-recipe-form").addEventListener("submit", function(e) {
        e.preventDefault();
        submitRecipe(existingRecipe, existingRecipeName, recipeTags)
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
        fillExistingDetails(existingRecipe, recipeTags);
    }
}

const fillExistingDetails = async function(recipe, recipeTags) {
    document.querySelector("#name").value = recipe.name;
    document.querySelector("#servings").value = recipe.servings;
    document.querySelector("#ingredients").value = recipe.ingredients.join("\n");
    document.querySelector("#instructions").value = recipe.instructions.join("\n");

    const img = document.createElement("img");
    img.src = recipe.image;
    showImagePreview(img);

    recipe.tags.forEach(t => {
        // can't assign recipe.tags to recipeTags as arrays are passed by reference
        recipeTags.push(t);
        addTagElement(t, ".tags-container").addEventListener("click", function(e) {
            e.preventDefault();
            removeTagElement(this, ".tags-container");
            removeTagFromArray(t, recipeTags);
        });
    });

    if (recipe.favourite) {
        document.querySelector("#favourite").checked = true;
    }
}

const submitRecipe = async function(existingRecipe, existingRecipeName, recipeTags) {
    
    // show error message if image not uploaded
    if (document.querySelector("#file-input").disabled == false) {
        alert("Please upload an image");
    } else {
        // show error message if recipe name is not unique
        const nameInput = document.querySelector("#name");
        const newName = nameInput.value.toLowerCase();
        if (await nameUsed(existingRecipeName, newName)) {
            alert("A recipe with this name already exists");
            nameInput.value = "";
        } else {
            const recipe = createRecipeObject(recipeTags);
            await saveRecipe(existingRecipeName, recipe);
            redirectToHomePage();
        }
    }
    
}

const nameUsed = async function(existingRecipeName, newName) {
    const recipes = await localforage.getItem("recipes") || [];
    // if editing recipe and name is unchanged, return false
    if (existingRecipeName && newName === existingRecipeName) {
        return false;
    } else {
        return recipes.some(r => r.name === newName);
    }
}

const createRecipeObject = function(tags) {
    const form = document.querySelector(".new-recipe-form");
    const name = form.querySelector("#name").value.toLowerCase();
    const favourite = document.querySelector("#favourite").checked;
    const lastAccessed = new Date();
    const servings = form.querySelector("#servings").value;
    const ingredients = form.querySelector("#ingredients").value.split("\n");
    const instructions = form.querySelector("#instructions").value.split("\n");
    const image = form.querySelector("img").src;
    return {name, favourite, lastAccessed, servings, ingredients, instructions, tags, image};
}

const saveRecipe = async function(existingRecipeName, recipe) {
    const recipes = await localforage.getItem("recipes") || [];
    // replace current recipe with updated recipe if editing
    if (existingRecipeName) {
        const existingIndex = recipes.findIndex(r => r.name === existingRecipeName);
        recipes[existingIndex] = recipe;
    } else {
        recipes.push(recipe);
    }
    await localforage.setItem("recipes", recipes);
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
        deleteBtn.addEventListener("click", function(e) {
            e.preventDefault();
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

    showImagePreview(img);
}

const showImagePreview = function(img) {
    document.querySelector(".img-preview-container").appendChild(img);

    // hide label and disable input
    document.querySelector("#file-input").disabled = true;
    document.querySelector(".img-drop-area label").classList.toggle("hide");
    document.querySelector(".img-preview-container").classList.toggle("hide");
}

const removeImage = function(e) {
    e.preventDefault();
    
    //remove img element
    const img = document.querySelector(".img-preview-container img");
    document.querySelector(".img-preview-container").removeChild(img);
    
    // show label and enable input
    document.querySelector("#file-input").disabled = false;
    document.querySelector(".img-drop-area label").classList.toggle("hide");
    document.querySelector(".img-preview-container").classList.toggle("hide");
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
