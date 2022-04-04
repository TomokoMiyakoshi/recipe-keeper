export const populateWithTags = function(formControlSelector) {
    const tags = JSON.parse(localStorage.getItem("tags"));
    // to display tag options in alphabetical order
    tags.sort();
    const formControl = document.querySelector(formControlSelector);
    tags.forEach(t => {
        const option = document.createElement("option");
        option.value = t;
        option.innerText = t;
        formControl.appendChild(option);
    });
};

export const addTagElement = function(value, containerSelector) {
    const tag = document.createElement("div");
    tag.innerText = value;
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-tag-btn");
    const icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add("fa-close");
    deleteBtn.appendChild(icon);
    tag.appendChild(deleteBtn);
    document.querySelector(containerSelector).appendChild(tag);
    return deleteBtn;
};

export const removeTagElement = function(deleteBtn, containerSelector) {
    const tagElem = deleteBtn.parentElement;
    document.querySelector(containerSelector).removeChild(tagElem);
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
    const option = document.createElement("option");
    option.value = tagValue
    option.innerText = tagValue;
    dropdown.appendChild(option);
}