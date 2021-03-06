import { setCACHE } from "./modules/cache.js";
import { createNewList, buildSavedList, returnSavedList, manageGroceryList } from "./modules/localStorage.js";
import { toggleTaxes } from "./modules/taxes.js";
import { convertCurrency } from "./modules/currencyConversion.js";

const CACHE = setCACHE();
initialize();

/**************************************************************** */
  // FUNCTION DEFINITIONS 
/* ************************************************************** */

function initialize(){
  localStorage.length < 1 ?  createNewList() : buildSavedList().forEach(el => addGroceryItemToDOM(el));
  CACHE.totalPrice();

  (function addButtonEventListeners(){
    document.getElementById('btn-add-item').addEventListener('click', buildAddGroceryInputs);
    document.getElementById('btn-del-item').addEventListener('click', buildDeleteGroceryInputs);
    document.getElementById('btn-select-all').addEventListener('click', selectAllToggle);
    document.getElementById('btn-reset').addEventListener('click', reset);
  }());

  // BUILD AND APPEND DOM ELEMENTS
  function buildAddGroceryInputs() {
    var elToAppendTo = document.getElementById('edit-items-section');
    var buttonStates = ['btn-add-item', 'btn-del-item', 'btn-reset', 'btn-select-all']
    var itemField = buildInput('text', 'field-add-item', 'item', clearValue);
    var itemQuantity = buildInput('text', 'field-quantity', 'amount', clearValue);
    var saveButton = buildInput('button', 'btn-save', 'SAVE', addGroceryItem);
    itemField.classList.add('form-control');
    itemQuantity.classList.add('form-control');
    var newElements = [itemField, itemQuantity, saveButton];
    clearElement('edit-items-section');
    displayActiveButton(buttonStates);
    newElements.forEach(el => elToAppendTo.appendChild(el));
  }

  function buildGroceryItem() {
    var nameField = document.getElementById('field-add-item');
    var quantityField = document.getElementById('field-quantity');
    var item = { name: nameField.value, quantity: quantityField.value, price: 'unassigned' };
    return item;
  }

  function deleteGroceryItemFromDOM(row) {
    row.remove();
  }

  function addGroceryItemToDOM(item) {
    createGroceryItemRow(item);
    addRatesCheckboxes();
    // if select all toggle is on, add checked value to new item checkbox
    if (document.getElementById('btn-select-all').textContent == 'DESELECT ALL') {
      document.getElementById(item.name).checked = true;
    }
  }

  function addRatesCheckboxes() {
    var rateTBody = document.getElementById('rate-tbody');
    if (rateTBody.children.length === 0) {
      let row = rateTBody.insertRow();
      row.id = 'rate-row';
      for (let i = 0; i <= 3; i++) {
        let cell = row.insertCell();
        cell.id = 'rate-row-cell-' + i;
      }
      document.getElementById('rate-row-cell-1').innerText = "Add Taxes";
      document.getElementById('rate-row-cell-3').innerText = "Convert Currency";
      createCheckbox({ name: 'tax-rate-checkbox' }, createTaxRateElements, document.getElementById('rate-row-cell-0'));
      createCheckbox({ name: 'currency-rate-checkbox' }, createCurrencySelector, document.getElementById('rate-row-cell-2'));
    }
  }

  function buildDeleteGroceryInputs() {
    var elToAppendTo = document.getElementById('edit-items-section');
    var buttonStates = ['btn-del-item', 'btn-add-item', 'btn-reset', 'btn-select-all'];
    var deleteField = buildInput('text', 'field-delete-item', 'item to delete', clearValue);
    var deleteButton = buildInput('button', 'btn-field-del-item', 'DELETE', deleteGroceryItem);
    clearElement('edit-items-section');
    displayActiveButton(buttonStates);
    deleteField.classList.add('form-control');
    elToAppendTo.appendChild(deleteField);
    elToAppendTo.appendChild(deleteButton);
  }

  function createGroceryItemRow(item) {
    var table = document.querySelector('tbody');
    var row = table.insertRow();
    var cell = row.insertCell();
    row.classList.add('grocery-row');
    createCheckbox(item, manageTableTotals, cell);
    createCellData(item, row);
  }

  function createCellData(item, row) {
    for (let [key, value] of Object.entries(item)) {
      let cell = row.insertCell();
      if (value == 'unassigned') {
        createPriceButton(item.name, cell);
      } else {
        if (key == 'price') { value = '$' + parseFloat(value).toFixed(2) };
        let text = document.createTextNode(value);
        cell.appendChild(text);
      }
    }
  }

  function createPriceButton(item, cell) {
    var priceButton = buildInput('button', `${item}-price`, 'Add Price')
    priceButton.addEventListener('click', createPriceField.bind(null, item, cell)) // bind item param to createPriceField
    priceButton.classList.add('btn-add-price');
    cell.appendChild(priceButton);
  }

  function createPriceField(item, cell) {
    var priceField = buildInput('text', 'item-price-field', '');
    var savePriceButton = buildInput('button', `save-${item}-price`, 'Save');
    savePriceButton.addEventListener('click', savePrice.bind(null, item, cell));
    priceField.classList.add('form-control');
    cell.innerHTML = '';
    cell.appendChild(priceField);
    cell.appendChild(savePriceButton);
  }

  function savePrice(item, cell) {
    var price = cell.children[0].value;
    if (Number.isNaN(parseFloat(price))) {
      createNaNError();
    } else {
      // data
      manageGroceryList('updateItem', item, price);
      // dom
      addPriceToCell(price, cell);
      manageTableTotals();
    }
  }

  function addPriceToCell(price, cell) {
    cell.innerHTML = '$' + (parseFloat(price)).toFixed(2);
  }

  function addGroceryItem() {
    var quantityField = document.getElementById('field-quantity');
    if (Number.isNaN(parseFloat(quantityField.value))) {
      createNaNError();
    }
    else {
      let itemField = document.getElementById('field-add-item');
      let currentItem = buildGroceryItem();
      // data 
      manageGroceryList('addItem', currentItem);
      // dom
      addGroceryItemToDOM(currentItem);
      manageTableTotals();
      itemField.value = 'item';
      quantityField.value = 'amount';
    }
  }

  function deleteGroceryItem() {
    var currentItem = document.getElementById('field-delete-item').value;
    var row = document.getElementById(`${currentItem}`).parentElement.parentElement;
    // data
    manageGroceryList('deleteItem', currentItem);
    // dom
    deleteGroceryItemFromDOM(row);
    manageTableTotals();
    clearElement('edit-items-section');
    if (returnSavedList().length < 1) {
      clearElement('rate-tbody');
    }
  }

  function updateDOMItemCount(count) {
    document.getElementById('items-num').innerText = count;
  }

  function updateDOMTotalPrice(price) {
    CACHE.element.price.innerText = price.toFixed(2);
  }

  function selectAllToggle(event) {
    var buttonStates = ['btn-select-all', 'btn-add-item', 'btn-del-item', 'btn-reset'];
    var selectAllButton = document.getElementById('btn-select-all');
    clearElement('edit-items-section');
    displayActiveButton(buttonStates);
    toggleButtonsAndBoxes();
    manageTableTotals();

    function toggleButtonsAndBoxes() {
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

  function reset() {
    var buttonStates = ['btn-reset', 'btn-add-item', 'btn-del-item', 'btn-select-all'];
    displayActiveButton(buttonStates);
    var confirmDelete = confirm("Are you sure you want to permanently delete your list?");
    if (confirmDelete == true) {
      clearElement('edit-items-section');
      clearElement('grocery-tbody');
      clearElement('rate-tbody');
      CACHE.element.price.innerText = 0;
      CACHE.totalPrice(0.00);
      CACHE.taxRate(0.00);
      document.getElementById('items-num').innerText = 0;
      manageGroceryList('resetList');
      setCACHE();
      initialize();
    }
  }

  // UTILITY FUNCTIONS 
  function manageTableTotals() {
    var selectedItems = collectCheckedBoxes();
    var numsArray = filterListForSelected(selectedItems);
    var price = totalPrice(numsArray);
    updateDOMTotalPrice(price);
    updateDOMItemCount(countItems(numsArray));
    toggleTaxes(CACHE);
  }

  function collectCheckedBoxes() {
    var checkboxes = Array.from(document.getElementsByClassName('ckbx-styled grocery'));
    var items = [];
    for (const element of checkboxes) {
      if (element.checked == true) { items.push(element.id) };
    }
    return items;
  }

  function createNaNError() {
    alert('Only NUMBERS allowed in number fields!');
  }

  // TAX RATE elements
  function createTaxRateElements(event) {
    // any changes to total price reset currency exchange elements 
    var taxRateCell = document.getElementById('rate-row-cell-1');
    if (event.target.checked && event.target.id == "tax-rate-checkbox" && taxRateCell.textContent == 'Add Taxes') {
      let taxRateInputField = buildInput('text', 'tax-rate-input-field', '0.0', clearValue);
      let taxRateButton = buildInput('button', 'tax-rate-button', 'Add Tax', toggleTaxes.bind(null, CACHE)); 
      let elToAppendTo = document.getElementById('rate-row-cell-1');
      taxRateInputField.classList.add('form-control');
      elToAppendTo.innerText = '';
      elToAppendTo.appendChild(taxRateInputField);
      elToAppendTo.appendChild(taxRateButton);
    } else {
      toggleTaxes(CACHE);
    }
  }

  // CURRENCY CONVERSION elements
  function createCurrencySelector() {
    var elToAppendTo = document.getElementById('rate-row-cell-3');
    var currencyTypesArray = [['usd', 'cad'], ['cad', 'usd'], ['usd', 'mxn'], ['mxn', 'usd'], ['cad', 'mxn'], ['mxn', 'cad']];
    var currencyDropDownMenu = createDropDownMenu(currencyTypesArray);
    clearElement('rate-row-cell-3');
    elToAppendTo.appendChild(currencyDropDownMenu);

    function createDropDownMenu(selectValues) {
      var menuDiv = document.createElement('div');
      var menuSelect = document.createElement('select');
      var menuButton = buildInput('button', 'currency-drop-down-button', 'Convert', convertCurrency.bind(null, CACHE));
      menuDiv.classList.add('col-sm-2');
      menuSelect.classList.add('form-control');
      menuSelect.style.width = '110px';
      menuButton.classList.add('custom-select-button');
      menuDiv.appendChild(menuSelect);

      for (let length = selectValues.length, i = 0; i < length; i++) {
        let currencyOption = document.createElement('option');
        let currencyTextNode = document.createTextNode(`${selectValues[i][0]} to ${selectValues[i][1]}`)
        currencyOption.value = `${selectValues[i]}`;
        currencyOption.classList.add('form-control');
        currencyOption.appendChild(currencyTextNode);
        menuSelect.appendChild(currencyOption);
      }
      menuDiv.appendChild(menuButton);
      return menuDiv;
    }
  }

  // FACTORY FUNCTIONS
  function buildInput(type, id, value, eventListenerToAdd) {
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
    if (checkboxEvent == manageTableTotals) { itemCheckbox.classList.add('grocery') };
    elToAppendTo.appendChild(itemCheckbox);
    itemCheckbox.addEventListener('click', checkboxEvent);
    if (labelContent != undefined) {
      var label = document.createTextNode(labelContent);
      elToAppendTo.appendChild(label);
    };
  }

  function displayActiveButton(buttonStates) {
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

  function filterListForSelected(selectedItems) {
    var filteredArray = [];
    var groceryList = returnSavedList();
    selectedItems.forEach(el => {
      for (const grocery of groceryList) {
        if (grocery.name == el) { filteredArray.push(grocery) };
      }
    })
    return filteredArray
  }

  // LOGIC AND CALCULATIONS 

  // add items
  function add(total, num) {
    return total + num;
  }

  // count items
  function countItems(itemsArray) {
    var count = [];
    itemsArray.map(el => {
      // add only one item for groceries measured by weight
      el.quantity.includes('.') ? count.push(1) : count.push(parseFloat(el.quantity, 10));
    })
    return count.reduce(add, 0);
  }

  // calculate cost
  function totalPrice(itemsArray) {
    var price;
    if (itemsArray.length < 1) {
      price = 0;
    } else {
      price = [];
      itemsArray.map(el => {
        let priceNum;
        let quantNum = parseFloat(el.quantity, 10);
        if (el.price === 'unassigned' || el.price === 'undefined') {
          priceNum = 0;
        } else {
          priceNum = parseFloat(el.price, 10);
        }
        price.push(quantNum * priceNum);
      })
      price = CACHE.totalPrice(price.reduce(add, 0));
    }
    return price;
  }
}





