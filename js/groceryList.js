export const initGroceryList = function() {
    document.querySelector(".search-btn").addEventListener("click", searchItem);
    document.querySelector("#search").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            searchItem(e);
        }
    });
    document.querySelector(".clear-searchbar-btn").addEventListener("click", clearSearch)
    document.querySelector(".add-item-btn").addEventListener("click", addItem);
    document.querySelector("#add-item").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            addItem(e);
        }
    });
    document.querySelector(".clear-list-btn").addEventListener("click", clearList);
    document.querySelector(".remove-checked-btn").addEventListener("click", removeCheckedItems);
    displayStoredItems();
}

const searchItem = function(e) {
    e.preventDefault();
    // hides all items that don't include the search term
    const searchTerm = document.querySelector("#search").value;
    const items = document.querySelectorAll(".grocery-list li");
    let resultsCount = 0;
    items.forEach(item => {
        if (!item.firstElementChild.value.includes(searchTerm)) {
            item.style.display = "none";
        } else {
            resultsCount ++;
        }
    });

    // display message if no matches found
    if (resultsCount === 0) {
        document.querySelector(".no-results-message").style.display = "block";
        toggleDisplayClearRemoveBtns(false);
    }

    // show clear search bar btn
    document.querySelector(".clear-searchbar-btn").classList.remove("hide");
    
}

const clearSearch = function(e) {
    // function may not be triggered by clicking clear search button
    if (e) e.preventDefault();
    document.querySelector("#search").value = "";
    const items = document.querySelectorAll(".grocery-list li");
    items.forEach(item => item.style.display = "block");

    // search might have resulted in no results
    document.querySelector(".no-results-message").style.display = "none";

    // if list is not empty, show buttons
    if (items.length > 0) {
        toggleDisplayClearRemoveBtns(true);
    }
    // hide clear search bar btn
    document.querySelector(".clear-searchbar-btn").classList.add("hide");
    
}


const displayStoredItems = async function() {
    const list = await localforage.getItem("list") || [];
    if (list.length != 0) {
        list.forEach(item => addItemElement(item.value, item.checked));
    } else {
        toggleDisplayClearRemoveBtns(false);
    }
}

const toggleDisplayClearRemoveBtns = function(displayValue) {
    let display = displayValue ? "inline-block" : "none";
    document.querySelector(".clear-list-btn").style.display = display;
    document.querySelector(".remove-checked-btn").style.display = display;
}

const addItem = async function(e) {
    e.preventDefault();
    const input = document.querySelector("#add-item");
    const value = input.value.trim();
    if (value != "") {
        try {
            await saveItem(value);
            if (document.querySelector("#search").value != "") {
                clearSearch();
            } else {
                // clear search already contains call to toggleDisplayClearRemoveBtns(true)
                toggleDisplayClearRemoveBtns(true);
            }
            addItemElement(value);
            
        } catch (e) {
            alert(e);
        }
    }
    input.value = "";
}


const saveItem = async function(value) {
    const list = await localforage.getItem("list") || [];
    if (list.some(item => item.value === value)) {
        throw "The list already contains the item " + value;
    }
    const item = {
        value:  value,
        checked: false
    }
    list.push(item);
    await localforage.setItem("list", list);
}

const addItemElement = function(value, checked=false) {
    const check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    check.value = value;
    check.id = value;
    check.checked = checked;
    check.addEventListener("click", checkOrUncheck);
    const label = document.createElement("label");
    label.htmlFor = value;
    label.appendChild(document.createTextNode(value));
    const deleteBtn = document.createElement("button");
    deleteBtn.addEventListener("click", deleteItem);
    deleteBtn.innerHTML = "&times;";
    const li = document.createElement("li");
    li.appendChild(check);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    if (checked) {
        document.querySelector(".inactive-list").appendChild(li);
    } else {
        document.querySelector(".active-list").appendChild(li);
    }

    // if this is the first item added to the list, display the buttons above the list
    if (document.querySelector(".active-list").childElementCount == 1) {
        toggleDisplayClearRemoveBtns(true);
    }
    
}

const deleteItem = async function(e) {
    e.preventDefault();
    const item = e.target.parentElement.querySelector("input").value;
    deleteItemStore(item);
    deleteItemElement(e);
}

const deleteItemStore = async function(value) {
    const list = await localforage.getItem("list");
    const itemIndex = list.findIndex(item => item.value === value);
    list.splice(itemIndex, 1);
    localforage.setItem("list", list);
}

const deleteItemElement = function(e) {
    const li = e.target.parentElement;
    li.remove(); 
    // if there are no more items in the list, hide the buttons above the list
    if (document.querySelector(".active-list").childElementCount == 0 && 
        document.querySelector(".inactive-list").childElementCount ==  0) {
        toggleDisplayClearRemoveBtns(false);
    }
} 

const checkOrUncheck = function(e) {
    updateCheckedStorage(e);
    movePosition(e);
}

const updateCheckedStorage = async function(e) {
    const value = e.target.value;
    const list = await localforage.getItem("list");
    const itemIndex = list.findIndex(item => item.value === value);
    list[itemIndex].checked = e.target.checked;
    localforage.setItem("list", list);
}

const movePosition = function(e) {
    const li = e.target.parentElement;
    if (e.target.checked) {
        li.remove();
        document.querySelector(".inactive-list").appendChild(li);
    } else {
        li.remove();
        document.querySelector(".active-list").appendChild(li);
    }
}

const clearList = async function() {
    if (confirm("Are you sure you wish to remove all items from the list?")) {
        await localforage.setItem("list", []);
        location.reload();
    }
}

const removeCheckedItems = async function() {
    let list = await localforage.getItem("list");
    list = list.filter(item => !item.checked);
    await localforage.setItem("list", list);
    location.reload();
}


export const updateListFromRecipe = async function(e) {
    e.preventDefault();
    const ingList = document.querySelectorAll(".ing-container li");
    // cannot use await with forEach(), or any function with a callback
    for (let i = 0; i < ingList.length; i++) {
        const checkbox = ingList[i].firstElementChild;
        if (checkbox.checked) {
            try {
                await saveItem(checkbox.value);
            } catch (e) {
                alert(e);
            }
        }
    }
    location.reload();
}


