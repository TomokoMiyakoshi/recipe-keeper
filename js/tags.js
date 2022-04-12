export const populateWithTags =　async function(formControlSelector) {
    const tags = await getTags();
    
    const formControl = document.querySelector(formControlSelector);
    tags.forEach(t => {
        const option = document.createElement("option");
        option.value = t;
        option.innerText = t;
        formControl.appendChild(option);
    });
};

const getTags = async function() {
    const recipes = await localforage.getItem("recipes") || [];
    let tags = [];
    recipes.forEach(r => tags = tags.concat(r.tags));
    // return tags in alphabetical order
    return Array.from(new Set(tags)).sort();
}

export const addTagElement = function(value, containerSelector, removable=true) {
    const tag = document.createElement("div");
    tag.innerText = value;
    if (removable) {
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-tag-btn");
        const icon = document.createElement("i");
        icon.classList.add("fa");
        icon.classList.add("fa-close");
        deleteBtn.appendChild(icon);
        tag.appendChild(deleteBtn);
        document.querySelector(containerSelector).appendChild(tag);
        return deleteBtn;
    }
    document.querySelector(containerSelector).appendChild(tag);
    return tag;
};

export const removeTagElement = function(deleteBtn) {
    const tagElem = deleteBtn.parentElement;
    tagElem.remove();
};

export const clearTagFormControl = function(controlSelector) {
    const control = document.querySelector(controlSelector);
    // if control is an input element, set selected option to default option
    if (control.tagName === "SELECT") {
        control.selectedIndex = 0;
    } else {
        document.querySelector(controlSelector).value = "";
    }
};

export const removeTagFromDropdown = function() {
    const dropdown = document.querySelector("#tag-filter");
    const option = dropdown.options[dropdown.selectedIndex];
    dropdown.removeChild(option);
}

export const addTagToDropdown = function(tagValue) {
    const dropdown = document.querySelector("#tag-filter");
    for (var i = 0; i < dropdown.length; i++) {
        if (tagValue < dropdown[i].value) {
            break;
        }
    }

    const option = document.createElement("option");
    option.value = tagValue
    option.innerText = tagValue;
    dropdown.add(option,i);
}