var groceryList = [];
initialize(); 

//*****************************************************************
function initialize(){
  void function addEventListeners(){
    document.getElementById('btn-add-item').addEventListener('click', buildAddGroceryInputs);
    document.getElementById('btn-del-item').addEventListener('click', buildDeleteGroceryInputs);
    document.getElementById('btn-reset').addEventListener('click', reset);
  }();
}

// DISPLAY DATA
// BUILD AND APPEND DOM ELEMENTS
function buildAddGroceryInputs(){
  var elToAppendTo = document.getElementById('edit-items-section');
  var itemField = buildInput('text', 'field-add-item', 'item', clearValue);
  var itemQuantity = buildInput('text', 'field-quantity', 'quantity', clearValue);
  var saveButton = buildInput('button', 'btn-save', 'SAVE', addItem);
  var newElements = [itemField,itemQuantity, saveButton]
  clearElement('edit-items-section');
  newElements.forEach(el => elToAppendTo.appendChild(el))
}

function buildGroceryItem() {
  var nameField = document.getElementById('field-add-item');
  var quantityField = document.getElementById('field-quantity');
  var item = { name: nameField.value, quantity: quantityField.value, price: 'unassigned' };
  return item;
}

function addItemToDOM(item){
  displayActiveADDButton();
  createItemRow(item);
  updateTable('add');

 //*************************************** */ 
  function displayActiveADDButton(){
    var buttonStates = ['btn-add-item', 'btn-del-item', 'btn-reset']
    var inputField = document.getElementById('field-add-item');
    clearElement('edit-items-section');
    displayActiveButton(buttonStates);
  };   
}

function buildDeleteGroceryInputs(){
  var buttonStates = ['btn-del-item', 'btn-add-item', 'btn-reset']
  var elToAppendTo = document.getElementById('edit-items-section');
  var deleteField = buildInput('text', 'field-delete-item', 'item to delete', clearValue)
  var deleteButton = buildInput('button', 'btn-field-del-item', 'Delete', deleteItem)
  clearElement('edit-items-section');
  displayActiveButton(buttonStates);
  elToAppendTo.appendChild(deleteField);
  elToAppendTo.appendChild(deleteButton);
} 

function deleteItemFromDOM(row){
  row.remove();
  updateTable();
}

function createItemRow(item){  
  var table = document.querySelector('tbody');
  table.insertRow();
  createCheckbox(item);
  createCellData(item);
}  

function createCheckbox(item){
  var row = storeRow();
  var itemCheckbox = document.createElement('input');
  var cell = row.insertCell();
  itemCheckbox.type = 'checkbox';
  itemCheckbox.id = item.name;
  itemCheckbox.classList.add('ckbx-styled');
  cell.appendChild(itemCheckbox);
  itemCheckbox.addEventListener('change', function total(){ 
    if (this.checked){
      createTotalCount();
      createTotalPrice();  
    } 
  })
}

function createCellData(item){
  var row = storeRow();
  var itemData = Object.values(item);
  itemData.forEach(el => {
    let cell = row.insertCell();
    if (el == 'unassigned') {
      createPriceButton(itemData[0], cell);
    } else {
      let text = document.createTextNode(el);
      cell.appendChild(text);
    }
  })  
}

function createPriceButton(item, cell){
  var priceButton = buildInput('button', `${item}-price`, 'Add Price')
  priceButton.addEventListener('click', createPriceField.bind(null, item, cell)) // bind item param to createPriceField
  cell.appendChild(priceButton);
}

function createPriceField(item, cell){
  var priceField = buildInput('text', 'item-price-field', '');
  var savePriceButton = buildInput('button', `save-${item}-price`, 'Save')
  savePriceButton.addEventListener('click', savePrice.bind(null, item, cell))
  cell.innerHTML = '';
  cell.appendChild(priceField);
  cell.appendChild(savePriceButton); 
}

function addPriceToDOM(price, cell){
  cell.innerHTML = '$' + price; 
}

function updateTable(operation){
  //createTotalCount();
  //createTotalPrice(operation);
}

function updateDOMItemCount(count){
  document.getElementById('items-num').innerText = count;
}
function updateDOMCost(){}

function reset(){
  var buttonStates = ['btn-reset', 'btn-add-item', 'btn-del-item']
  displayActiveButton(buttonStates);
  clearElement('edit-items-section');
  clearElement('grocery-items-section');
  document.getElementById('cost-num').innerText = 0;
  document.getElementById('items-num').innerText = 0;
  cost = 0;
  manageGroceryList('resetList')
  intialize();
}

// UTILITY FUNCTIONS 
// divides the work between DOM and Data manipulation into seperate functions
function addItem(){
  var currentItem = buildGroceryItem();
  // data 
  manageGroceryList('addItem', currentItem) 
  clearElement('field-add-item');
  clearElement('field-quantity');
  // dom
  addItemToDOM(currentItem);
  
}

function deleteItem(){
  var currentItem = document.getElementById('field-delete-item').value
  var row = document.getElementById(`${currentItem}`).parentElement.parentElement
  deleteItemFromDOM(row);
  manageGroceryList('deleteItem', currentItem)
  clearElement('edit-items-section');
}

function savePrice(item, cell){
  //get price, get item
  var price = cell.children[0].value;
  // data
  manageGroceryList('addPrice', item, price);
  // dom
  addPriceToDOM(price, cell);
}

function createTotalPrice(){
  // data
  var price = calculateCost();
  // dom
  updateDOMCost(price);
}

function createTotalCount(){
  var checkboxes = Array.from(document.getElementsByClassName('ckbx-styled'))
  var selectedItems = (function countCheckboxes(){
    var items = [];
    for (const element of checkboxes) {
      if (element.checked == true) { items.push(element.id) };
    }
    return items;
  }()); 
  // data
  var count = countItems(selectedItems);
  // dom
  updateDOMItemCount(count);
} 

// storage functions for DOM elements using closure
//function storeItem() {
// future closure here
//  var item;
// { item =  }
//  return item;
//}

function storeCell() {
  // future closure here
  var cell;
  { cell = document.getElementById('grocery-table').children[0].lastChild.lastChild }
  return cell;
}

function storeRow() {
  // future closure
  var row;
  { row = document.getElementById('grocery-table').children[0].lastChild }
  return row;
}

// factory functions
function buildInput(type, id, value, eventListenerToAdd){
  var newInput = document.createElement('input');
  newInput.type = type;
  newInput.id = id;
  newInput.value = value;
  if (eventListenerToAdd != undefined) {
    newInput.addEventListener('click', eventListenerToAdd);
  }
  return newInput;
}

function clearValue(){
  this.value = '';
}

function clearElement(id){
  document.getElementById(id).innerHTML = '';
}

function displayActiveButton(buttonStates){
  buttonStates.forEach(el => {
    if (el == buttonStates[0]) {
      document.getElementById(el).classList.add('active');
    } else {  
      if (document.getElementById(el).classList.contains('active')) {
        document.getElementById(el).classList.remove('active');
      }
    }  
  })
}

// MANAGE DATA
// create closure to store GroceryList variable
function manageGroceryList(action, item, num){
  //if (groceryList == undefined) { groceryList = [] };
  directGroceryListAction(action, item, num);

/********************************************************** */

  function directGroceryListAction(action, item, num) {
    switch (action){
    case 'addItem': 
      addItemToGroceryList(item);
      break;

    case 'deleteItem':
      deleteItemFromGroceryList(item);
      break;

    case 'addQuantity':
      addQuantity(item, num);
      break;

    case 'addPrice':
      addPrice(item, num);
      break;

    case 'resetList':
      resetListGroceryList();
      break;  

    default: 
      return groceryList;  
    } 
    return groceryList;
  }

  function addItemToGroceryList(item){
    let newItem = {name: item.name, quantity: item.quantity, price: undefined}
    groceryList.push(newItem)
  }

  function deleteItemFromGroceryList(item){
    groceryList.forEach((el) => {
      if (el.name === item){
        let i = groceryList.indexOf(el);
        groceryList.splice(i, 1);
      }
    })
    return groceryList;
  }

  function addPrice(item, price) {
    for (const element of groceryList) {
      if (element.name == item) { element.price = price; }
    }
  } 

  function resetGroceryList(){
    groceryList = [];
  }
}

// LOGIC AND CALCULATIONS 

function countItems(selectedItems){
  debugger;
  var quantityArray = collectQuantities(selectedItems);
  //checked.push(parseInt(quantity, 10));
 
  // create closure to access groceryList without passing as parameter
  return quantityArray.reduce(add, 0);  
  
  function collectQuantities(selectedItems) {
    var quantity = selectedItems.forEach(el, filterGroceries)
  }

  function filterGroceries() {
    for (const grocery of groceryList) {
      if (grocery.name = el) {
        quantity.push(el.quantity)
      }
    }
  }
  return quantity;
}

// add items
function add(total, num) {
  return total + num;
}

// calculate cost
function calculateCost(){}

// add tax
function calculateTax(){}

// convert currency 
function convertCurrency(){}



