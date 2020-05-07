var groceryList = [];
var taxRate = 0;
var currencyRates;
initialize(); 

//*****************************************************************
function initialize(){
  void function addButtonEventListeners(){
    document.getElementById('btn-add-item').addEventListener('click', buildAddGroceryInputs);
    document.getElementById('btn-del-item').addEventListener('click', buildDeleteGroceryInputs);
    document.getElementById('btn-select-all').addEventListener('click', selectAllToggle);
    document.getElementById('btn-reset').addEventListener('click', reset);
  }();
}

// DISPLAY DATA
// BUILD AND APPEND DOM ELEMENTS
function buildAddGroceryInputs(){
  var elToAppendTo = document.getElementById('edit-items-section');
  var buttonStates = ['btn-add-item', 'btn-del-item', 'btn-reset', 'btn-select-all']
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
  var buttonStates = ['btn-del-item', 'btn-add-item', 'btn-reset', 'btn-select-all']
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
  var countEl = document.getElementById('count-num')
  isNaN(count) ? createNaNError() : countEl.innerText = count;
}
function updateDOMItemPrice(price){
  var priceEl = document.getElementById('cost-num')
  isNaN(price) ? createNaNError() : priceEl.innerText = price;
} 

function createNaNError(){
  var errorDiv = document.createElement('div');
  var bodyDiv = document.getElementsByTagName('body')[0]
  errorDiv.classList.add('error-msg');
  errorDiv.innerText = 'Cannot perform calculations with illegal characters! Please add numbers only to quantity, price and tax fields. Delete invalid items or reset list to continue.';
  document.getElementById('grocery-total-section').appendChild(errorDiv);
  bodyDiv.addEventListener('click', deleteError);
  function deleteError(){
   setTimeout(errorDiv.remove(), 1000);
  }
}

function selectAllToggle(event){
  var buttonStates = ['btn-select-all', 'btn-add-item', 'btn-del-item', 'btn-reset'];
  var selectAllButton = document.getElementById('btn-select-all');
  clearElement('edit-items-section');
  displayActiveButton(buttonStates);
  toggleButtonsAndBoxes();
  manageTableTotals();

  function toggleButtonsAndBoxes(){
    if (selectAllButton.innerText == 'SELECT ALL') {
      selectAllButton.innerText = 'DESELECT ALL';
      changeCheckboxes('select');
    } else {
      selectAllButton.innerText = 'SELECT ALL';
      changeCheckboxes('deselect');
    }
    function changeCheckboxes(action) {
      var groceryCheckboxes = Array.from(document.getElementsByClassName('ckbx-styled grocery'));
      groceryCheckboxes.forEach(el => {
        action == 'select' ? el.checked = true : el.checked = false;
      })
    }
  } 
}

function reset(){
  var buttonStates = ['btn-reset', 'btn-add-item', 'btn-del-item', 'btn-select-all']
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
  itemField.value = 'item';
  quantityField.value = 'quantity';
  addGroceryItemToDOM(currentItem); 
}

function deleteGroceryItem(){
  var currentItem = document.getElementById('field-delete-item').value
  var row = document.getElementById(`${currentItem}`).parentElement.parentElement
  deleteGroceryItemFromDOM(row);
  manageGroceryList('deleteItem', currentItem)
  clearElement('edit-items-section');
  if (groceryList.length < 1) {
    clearElement('rate-tbody');
  }
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
  addPrice(numsArray);
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
  debugger;
  isNan(count[0]) ? count = NaN : count.reduce(add, 0); 
  return count; 
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
  var elToAppendTo = document.getElementById('rate-row-cell-3');
  var currencyTypesArray = [['usd', 'cad'], ['cad', 'usd'], ['usd', 'mxn'], ['mxn', 'usd'], ['cad','mxn'], ['mxn', 'cad']]
  var currencyDropDownMenu = createDropDownMenu(currencyTypesArray);  
  clearElement('rate-row-cell-3');
  elToAppendTo.appendChild(currencyDropDownMenu);
   
  function createDropDownMenu(selectValues){
    var menuDiv = document.createElement('div');
    var menuSelect = document.createElement('select');
    var menuButton = buildInput('button', 'currency-drop-down-button', 'convert', convertCurrency )
    menuDiv.classList.add('col-sm-2')
    menuSelect.classList.add('form-control')
    menuSelect.style.width = '125px';
    menuButton.classList.add('custom-select-button');
    menuDiv.appendChild(menuSelect);
  
    for(let length = selectValues.length, i = 0; i < length; i++) {
      let currencyOption = document.createElement('option');
      let currencyTextNode = document.createTextNode(`${selectValues[i][0]} to ${selectValues[i][1]}`)
      currencyOption.value = `${selectValues[i]}`;
      currencyOption.appendChild(currencyTextNode);
      menuSelect.appendChild(currencyOption); 
    }
    menuDiv.appendChild(menuButton); 
    return menuDiv;
  }
}

function convertCurrency(){
  var currencyArray = retrieveUserInput().split(',');
  var total = parseFloat(document.getElementById('cost-num').innerText, 10)
  calculateAndAppendConverted(currencyArray, total);
 
  function retrieveUserInput(){ 
    var options = Array.from(document.getElementsByTagName('select')[0].children);
    return options.filter(returnSelectedValue)[0].value;

    function returnSelectedValue(option) {
      if (option.selected == true) {return option.value};
    }
  }
  
  function calculateAndAppendConverted(currencyArray, total){
    try {
      fetchCurrencyRate(currencyArray[0]);      
    } catch(error) {
      console.log(error);
    }
  }  

  function fetchCurrencyRate(currency){ 
    var url = `https://prime.exchangerate-api.com/v5/51b51bd8875d058d36d9986d/latest/${currency.toUpperCase()}`
    fetch(url)
      .then(response => response.json())
      .then(json => formatRate(json))
      .then(rate => calculateExchangedTotal(rate))
      .then(totalExchanged => appendToDOM(totalExchanged))
  }

  function formatRate(data){
    currencyRates = data.conversion_rates;
    var currency = currencyArray[1].toUpperCase();
    var rate = currencyRates[`${currency}`];
    return rate;
  }

  function calculateExchangedTotal(rate){
    var price = parseFloat(document.getElementById('cost-num').innerText, 10);
    var totalExchanged = calculateRate(price, rate);
    return totalExchanged;
  }

  function appendToDOM(totalExchanged){
    var elToAppendTo = document.getElementById('rate-row-cell-3')
    elToAppendTo.innerHTML = `The total is ${ totalExchanged } ${ currencyArray[1].toUpperCase() }, converted from ${ currencyArray[0].toUpperCase() }.`;
  }
}
// tax rate functions
function createTaxRateElements(event){
  var addTaxCheckBox = document.getElementById('tax-rate-checkbox');
  //if event.target tax-rate-checkbox and event target = unchecked clear taxes from total 
  if (taxRate == 0 && event.target.checked == true && event.target == addTaxCheckBox) {
    let taxRateInputField = buildInput('text', 'tax-rate-input-field', '0.0', clearValue) ;
    let taxRateButton = buildInput('button', 'tax-rate-button', 'add tax', taxAndTotalToDOM);
    let elToAppendTo = document.getElementById('rate-row-cell-1');
    elToAppendTo.innerText = '';
    elToAppendTo.appendChild(taxRateInputField);
    elToAppendTo.appendChild(taxRateButton);
  } else if (taxRate != 0 && addTaxCheckBox.checked == true ) {
    taxAndTotalToDOM();
  } else {
    manageTableTotals();
  }
}

function taxAndTotalToDOM(){
  taxRate = document.getElementById('tax-rate-input-field').value; 
  var priceElement = document.getElementById('cost-num')
  var price = parseFloat(priceElement.innerText, 10);
  var taxOfTotal = calculateRate(price, parseFloat(taxRate, 10)/100);
  var totalWithTax = Math.round((price + taxOfTotal) * 100) / 100
  var taxElement = document.getElementById('rate-row-cell-1')
  var priceEl = document.getElementById('cost-num')
  isNaN(taxOfTotal) ? createNaNError() : taxRate.innerText = `Tax @ ${taxRate}% :  $${taxOfTotal}`;
  priceElement.innerText = `${totalWithTax}` 
}

//round one - if checkbox is selected and event is taxRate checkbox create fields and get the tax rate
//round two  - if taxRate is set and checkbox is selected calculate tax add to total
// round three - if taxRate is set and box is unselected remove tax set to zero and recalculate the total

// everytime the total price is recalculated, tax should be recalculated
// unchecking tax box should recalculated with out price without tax
// change event listener on taxbox once rate has been set


