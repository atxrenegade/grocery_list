var groceryList = [];
var taxRate = 0;
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
  var saveButton = buildInput('button', 'btn-save', 'SAVE', addGroceryItem);
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

function addGroceryItemToDOM(item){
  createItemRow(item); 
  addRatesCheckboxes();
}

function addRatesCheckboxes(){
  var rateTBody = document.getElementById('rate-tbody')
  if (rateTBody.children.length === 0){
    let row = rateTBody.insertRow();
    row.id = 'rate-row';
    for (let i = 0; i <= 3; i++){
        let cell = row.insertCell();
        cell.id = 'rate-row-cell-' + i;
    }
    document.getElementById('rate-row-cell-1').innerText = "Add Taxes";
    document.getElementById('rate-row-cell-3').innerText = "Convert Currency";
    createCheckbox({ name: 'tax-rate-checkbox' }, createTaxRateElements, document.getElementById('rate-row-cell-0'));
    createCheckbox({ name: 'currency-rate-checkbox' }, createCurrencySelector, document.getElementById('rate-row-cell-2'));
  }
}

function buildDeleteGroceryInputs(){
  var elToAppendTo = document.getElementById('edit-items-section');
  var buttonStates = ['btn-del-item', 'btn-add-item', 'btn-reset']
  var deleteField = buildInput('text', 'field-delete-item', 'item to delete', clearValue)
  var deleteButton = buildInput('button', 'btn-field-del-item', 'Delete', deleteGroceryItem)
  clearElement('edit-items-section');
  displayActiveButton(buttonStates);
  elToAppendTo.appendChild(deleteField);
  elToAppendTo.appendChild(deleteButton);
} 

function deleteGroceryItemFromDOM(row){
  row.remove();
  manageTableTotals();
}

function createItemRow(item){  
  var table = document.querySelector('tbody');
  var row = table.insertRow();
  var cell = row.insertCell();
  row.classList.add('grocery-row');
  createCheckbox(item, manageTableTotals, cell);
  createCellData(item);
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
  clearElement('rate-tbody');
  document.getElementById('cost-num').innerText = 0;
  document.getElementById('items-num').innerText = 0;
  cost = 0;
  manageGroceryList('resetList')
  initialize();
}

// UTILITY FUNCTIONS 
// divides the work between DOM and Data manipulation into seperate functions
function addGroceryItem(){
  var itemField = document.getElementById('field-add-item')
  var quantityField = document.getElementById('field-quantity')
  var currentItem = buildGroceryItem();
  // data 
  manageGroceryList('addItem', currentItem) 
  // dom
  itemField.value = '';
  quantityField.value = '';
  addGroceryItemToDOM(currentItem); 
}

function deleteGroceryItem(){
  var currentItem = document.getElementById('field-delete-item').value
  var row = document.getElementById(`${currentItem}`).parentElement.parentElement
  deleteGroceryItemFromDOM(row);
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
  manageTableTotals();
}

function manageTableTotals(){ 
  var selectedItems = collectCheckedBoxes();
  var numsArray = filterListForSelected(selectedItems); 
  var taxCheckBox = document.getElementById('tax-rate-checkbox');
  var totalPrice = addPrice(numsArray);
  addCount(numsArray);
  // create a form of closure to store tax rate
  if (taxCheckBox.checked == true && taxRate > 0) {
    taxAndTotalToDOM();
  }
}

function addCount(numsArray){
  var count = countItems(numsArray);
  updateDOMItemCount(count);
  return count;
}

function addPrice(numsArray){
  var price = totalPrice(numsArray);
  updateDOMItemPrice(price);
  return price;
}

function collectCheckedBoxes() {
  var checkboxes = Array.from(document.getElementsByClassName('ckbx-styled grocery'))
  var items = [];
  for (const element of checkboxes) {
    if (element.checked == true) { items.push(element.id) };
  }
  return items;
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

function createCheckbox(item, checkboxEvent, elToAppendTo, labelContent) {
  var itemCheckbox = document.createElement('input');
  itemCheckbox.type = 'checkbox';
  itemCheckbox.id = item.name;
  itemCheckbox.classList.add('ckbx-styled');
  if (item.price == 'unassigned'){ itemCheckbox.classList.add('grocery')}; 
  elToAppendTo.appendChild(itemCheckbox);
  itemCheckbox.addEventListener('click', checkboxEvent);
  if (labelContent != undefined) {
    var label = document.createTextNode(labelContent)
    elToAppendTo.appendChild(label)
  };
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

function clearValue() {
  this.value = '';
}

function clearElement(id) {
  document.getElementById(id).innerHTML = '';
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

function filterListForSelected(selectedItems){
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
  var numWithRate = (total * rate)
  return Math.round(numWithRate * 100) / 100
}

// add currency checkbox to existing table with event listener to call create currency selector

function createCurrencySelector(){
  // get cell to clear
  // clear cell
  // create drop down menu 
  // append to DOM 
  // addEventListener for fetchRequest
  // create drop down menu for currency exchange with all USD, MXD, CAD options
  // create button with event listener to convertCurrency()
  // append to DOM
  //
}

function convertCurrency(){
  var currencyArray = retrieveUserInput();
  var exchangeRate = getCurrencyRate(currency_array); //async await?
  var total = document.getElementById('price-num')
  var exchangeTotal = calculateRate(total, exchangeRate);
  var elToAppendTo = document.getElementById('rate-row-cell-3')
  elToAppendTo.innerHTML = `The converted total is ${exchangeTotal} ${currency_array[1]}.`;

  function retrieveUserInput(){ }
  function getCurrencyRate(){ }
  function appendResult(){ } 
}

// tax rate functions
function createTaxRateElements(event){
  debugger; 
  var addTaxCheckBox = document.getElementById('tax-rate-checkbox');
  //if event.target tax-rate-checkbox and event target = unchecked clear taxes from total 
  if (taxRate == 0 && event.target.checked == true && event.target == addTaxCheckBox) {
    var taxRateInputField = buildInput('text', 'tax-rate-input-field', '0.0', clearValue) ;
    var taxRateButton = buildInput('button', 'tax-rate-button', 'add tax', taxAndTotalToDOM);
    var elToAppendTo = document.getElementById('rate-row-cell-1');
    elToAppendTo.innerText = '';
    elToAppendTo.appendChild(taxRateInputField);
    elToAppendTo.appendChild(taxRateButton);
  } else if (taxRate != 0 && addTaxCheckBox.checked == true ) {
    taxAndTotalToDOM();
  } else {
    manageTableTotals();
  }
}
//round one - if checkbox is selected and event is taxRate checkbox create fields and get the tax rate
//round two  - if taxRate is set and checkbox is selected calculate tax add to total
// round three - if taxRate is set and box is unselected remove tax set to zero and recalculate the total

function taxAndTotalToDOM(){
  debugger;
  taxRate = document.getElementById('tax-rate-input-field').value; 
  var priceElement = document.getElementById('cost-num')
  var price = parseFloat(priceElement.innerText, 10);
  var taxOfTotal = calculateRate(price, parseFloat(taxRate, 10)/100);
  var totalWithTax = Math.round((price + taxOfTotal) * 100) / 100
  var taxElement = document.getElementById('rate-row-cell-1')
  taxElement.innerText = `Tax @ ${taxRate}% :  $${taxOfTotal}`;
  priceElement.innerText = `${totalWithTax}` 
}

// everytime the total price is recalculated, tax should be recalculated
// unchecking tax box should recalculated with out price without tax
// change event listener on taxbox once rate has been set


