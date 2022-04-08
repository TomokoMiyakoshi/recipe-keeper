// TODO: select recipe on hover or click and hold

import { addTagElement, removeTagElement, clearTagFormControl, populateWithTags, addTagToDropdown, removeTagFromDropdown } from "./tags.js";
import { displayRecipes } from "./displayRecipes.js";

var appliedTags = []
var newResults = [];
var searchTerm = "";
var currentCategory = "All";

export const initRecipeSearch = function() {
    document.querySelector(".search-btn").addEventListener("click", submitSearch);
    document.querySelector("#search").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            submitSearch(e);
        }
    });
    document.querySelector(".clear-searchbar-btn").addEventListener("click", clearSearchBar);

    document.querySelector("#tag-filter").addEventListener("change", submitTagFilter)
    
    document.querySelectorAll(".categories-btns-container button").forEach(
        btn => btn.addEventListener("click", changeCategory)
    );

    populateWithTags("#tag-filter");
    displayRecipes();
}

const clearSearchBar = async function(e) {
    e.preventDefault();
    document.querySelector("#search").value = "";
    // hide clear search bar btn
    document.querySelector(".clear-searchbar-btn").classList.add("hide");
    await updateResultsArray("remove search term");
    displayRecipes(newResults);
};

const submitSearch = async function(e) {
    e.preventDefault();
    const input = document.querySelector("#search");
    const value = input.value.trim().toLowerCase();
    if (value != "") {
        await updateResultsArray("new search term", value);
        displayRecipes(newResults);
        // show clear search bar btn
        document.querySelector(".clear-searchbar-btn").classList.remove("hide");
    }
};

const submitTagFilter = async function(e) {
    e.preventDefault();
    const value = document.querySelector("#tag-filter").value;
    await updateResultsArray("new tag", value);
    displayRecipes(newResults);
    removeTagFromDropdown()
    clearTagFormControl("#tag-filter");
    
    // add event listener to delete btn
    const deleteBtn = addTagElement(value, ".filter-tags-container");
    deleteBtn.addEventListener("click", removeTagFilter);
}


const removeTagFilter = async function() {
    const value = this.parentElement.innerText;
    await updateResultsArray("remove tag", value);
    addTagToDropdown(value);
    removeTagElement(this, ".filter-tags-container");
    displayRecipes(newResults);
};

const changeCategory = async function(e) {
    e.preventDefault();

    currentCategory = this.innerText;
    const recipes = await filterByCategory();
    displayRecipes(recipes);

    // change the button with the underline and bold styling
    styleCurrentCategory(this);

    // remove applied tags and search term
    document.querySelector("#search").value = "";
    const tags = document.querySelectorAll(".filter-tags-container > div");
    tags.forEach(tag => tag.remove());

    // clear applied tags and search term
    appliedTags.splice(0, appliedTags.length);
    searchTerm = "";
}

const styleCurrentCategory = function(newCategoryBtn) {
    // remove currentCategory class from previously selected button
    document.querySelector(".current-category").classList.remove("current-category");
    // add currentCategory class to selected button
    newCategoryBtn.classList.add("current-category");
};

const filterByCategory = async function() {
    const recipes = await localforage.getItem("recipes") || [];

    switch (currentCategory) {
        case "All":
            return recipes;
        case "Favourites":
            return recipes.filter(r => r["favourite"] == true);
        case "Recents":
            return await getRecents();
    }
}

const getRecents = async function() {
    const recipes = await localforage.getItem("recipes") || [];
    // sort in descending date order
    recipes.sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime());
    return recipes.slice(0, 9); 
}

export const updateResultsArray = async function(changeType, newValue) {
    const recipes = await filterByCategory();
   
    switch (changeType) {
        case "new search term" : 
            searchTerm = newValue;
            break;
        case "remove search term":
            searchTerm = "";
            break;
        case "new tag":
            appliedTags.push(newValue);
            break;
        case "remove tag":
            const index = appliedTags.indexOf(newValue);
            appliedTags.splice(index, 1);
            break;
    }
    newResults = recipes.filter(r => matchesAppliedFilters(r));
};

const matchesAppliedFilters = function(recipe) {
    return containsAllTags(recipe) && containsSearchTerm(recipe);
}

// returns true if all applied tags are in the recipe's list of tags
const containsAllTags = function(recipe) {
    let containsAll = true;
    let i = 0;
    while (containsAll && i < appliedTags.length) {
        if (!recipe.tags.includes(appliedTags[i])) containsAll = false;
        i ++;
    }
    return containsAll;
};

// returns true if recipe name or ingredients list contains searchTerm
const containsSearchTerm = function(recipe) {
    // check if searchTerm is in recipe name
    if (recipe.name.toLowerCase().includes(searchTerm)) return true;

    // if not in recipe name, check if searchTerm is in ingredients list
    const ingredients = recipe.ingredients.map(i => i.toLowerCase());
    let includes = false;
    let i = 0;
    while (!includes && i < ingredients.length) {
        if (ingredients[i].includes(searchTerm)) includes = true;
        i ++;
    }
    return includes;
};

