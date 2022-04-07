export const initGroceryList = function() {
    // document.querySelector(".search-btn").addEventListener("click", searchItem);
    document.querySelector(".add-item-btn").addEventListener("click", addItem);
    displayStoredItems();
}

const displayStoredItems = async function() {
    const list = await localforage.getItem("list") || [];
    list.forEach(item => addItemElement(item.value, item.checked));
}

const addItem = async function(e) {
    e.preventDefault();
    const input = document.querySelector("#add-item");
    const value = input.value.trim();
    input.value = "";
    try {
        await storeItem(value);
        addItemElement(value);
    } catch (e) {
        alert(e);
    }
}

const storeItem = async function(value) {
    const list = await localforage.getItem("list") || [];
    if (list.includes(value)) {
        throw "The list already contains the item " + value;
    }
    const item = {
        value:  value,
        checked: false
    }
    list.push(item);
    localforage.setItem("list", list);
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
    document.querySelector(".active-list").appendChild(li);
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
} 

const checkOrUncheck = async function(e) {
    const value = e.target.value;
    const list = await localforage.getItem("list");
    const itemIndex = list.findIndex(item => item.value === value);
    list[itemIndex].checked = e.target.checked;
    localforage.setItem("list", list);
}

