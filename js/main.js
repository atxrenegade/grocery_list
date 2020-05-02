var groceryList = [];
initialize(); 

//*****************************************************************
function initialize(){
  void function addButtonEventListeners(){
    document.getElementById('btn-add-item').addEventListener('click', buildAddGroceryInputs);
    document.getElementById('btn-del-item').addEventListener('click', buildDeleteGroceryInputs);
    document.getElementById('btn-reset').addEventListener('click', reset);
  }();
}

// DISPLAY DATA
// BUILD AND APPEND DOM ELEMENTS
function buildAddGroceryInputs(){
  var elToAppendTo = document.getElementById('edit-items-section');
  var buttonStates = ['btn-add-item', 'btn-del-item', 'btn-reset']
  var itemField = buildInput('text', 'field-add-item', 'item', clearValue);
  var itemQuantity = buildInput('text', 'field-quantity', 'quantity', clearValue);
  var saveButton = buildInput('button', 'btn-save', 'SAVE', addItem);
  var newElements = [itemField,itemQuantity, saveButton]
  clearElement('edit-items-section');
  displayActiveButton(buttonStates);
  newElements.forEach(el => elToAppendTo.appendChild(el))
} 

function buildGroceryItem() {
  var nameField = document.getElementById('field-add-item');
  var quantityField = document.getElementById('field-quantity');
  var item = { name: nameField.value, quantity: quantityField.value, price: 'unassigned' };
  return item;
}

function addItemToDOM(item){
  createItemRow(item);
  updateTable('add');   
}

function buildDeleteGroceryInputs(){
  var elToAppendTo = document.getElementById('edit-items-section');
  var buttonStates = ['btn-del-item', 'btn-add-item', 'btn-reset']
  var deleteField = buildInput('text', 'field-delete-item', 'item to delete', clearValue)
  var deleteButton = buildInput('button', 'btn-field-del-item', 'Delete', deleteItem)
  clearElement('edit-items-section');
  displayActiveButton(buttonStates);
  elToAppendTo.appendChild(deleteField);
  elToAppendTo.appendChild(deleteButton);
} 

function deleteItemFromDOM(row){
  row.remove();
  calculateCountAndPrice();
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
  itemCheckbox.addEventListener('click', calculateCountAndPrice); 
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
function updateDOMItemPrice(price){
  document.getElementById('cost-num').innerText = price;
}

function reset(){
  var buttonStates = ['btn-reset', 'btn-add-item', 'btn-del-item']
  displayActiveButton(buttonStates);
  clearElement('edit-items-section');
  clearElement('grocery-tbody');
  document.getElementById('cost-num').innerText = 0;
  document.getElementById('items-num').innerText = 0;
  cost = 0;
  manageGroceryList('resetList')
  initialize();
}

// UTILITY FUNCTIONS 
// divides the work between DOM and Data manipulation into seperate functions
function addItem(){
  var itemField = document.getElementById('field-add-item')
  var quantityField = document.getElementById('field-quantity')
  var currentItem = buildGroceryItem();
  // data 
  manageGroceryList('addItem', currentItem) 
  // dom
  itemField.value = '';
  quantityField.value = '';
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
  calculateCountAndPrice();
}

function calculateCountAndPrice(){
  var checkboxes = Array.from(document.getElementsByClassName('ckbx-styled'))
  var selectedItems = (function countCheckboxes(){
    var items = [];
    for (const element of checkboxes) {
      if (element.checked == true) { items.push(element.id) };
    }
    return items;
  }()); 
  // data
  var numsArray = filterSelected(selectedItems)
  var count = countItems(numsArray);
  var price = totalPrice(numsArray);
  // dom
  updateDOMItemCount(count);
  updateDOMItemPrice(price);
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
      resetGroceryList();
      break;  

    default: 
      return groceryList;  
    } 
    return groceryList;
  }

  function addItemToGroceryList(item){
    let newItem = {name: item.name, quantity: item.quantity, price: 'unassigned'}
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

function filterSelected(selectedItems){
  var filteredArray = [];
  selectedItems.forEach(el => {
    let subArray = [];
    for (const grocery of groceryList) {
      if (grocery.name == el) {  
        filteredArray.push(grocery)
      }
    }
  }) 
  return filteredArray
} 

// add items
function add(total, num) {
  return total + num;
}

function countItems(itemsArray){
  var count = [];
  itemsArray.map(el => {
    // add only one item for groceries measured by weight
    el.quantity.includes('.') ? count.push(1) : count.push(parseFloat(el.quantity, 10))
  }) 
  return count.reduce(add, 0);  
}

// calculate cost
function totalPrice(itemsArray){
  var price = [];
  itemsArray.map(el => {
    let quantNum = parseFloat(el.quantity, 10)
    let priceNum;
    if (el.price === 'unassigned' || el.price === 'undefined') {
      priceNum = 0;
    } else { 
      priceNum = parseFloat(el.price, 10);
    } 
    price.push(quantNum * priceNum)
  })
  price = price.reduce(add, 0)
  return Math.round(price * 100)/100
}

// use for tax and conversion rates?
function calculateRate(total, rate){
  var numWithRate = (rate * price)
  return Math.round(numWithRate * 100) / 100
}

function calculateTax(total, rate){
  return total + calculateRate(total, rate)
}


//add currency checkbox to existing table with event listener to call create currency selector

function createCurrencySelector(){
  // create drop down menu for currency exchange with all USD, MXD, CAD options
  // create button with event listener to convertCurrency()
  // append to DOM
  //
}

function convertCurrency(){
  // get input from user from drop down menu
  // asych await - invoke getCurrencyRate() to send fetch request to api
  // invoke 
  // create dom element with converted price and currency
  // append element to DOM
}

function getCurrencyRate(currency1, currency2){
  // fetch request to retrieve current rate
  // calculateRate() as a callback function
}


