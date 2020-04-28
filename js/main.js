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
  newElements.forEach(el => elToAppendTo.appendChild(el))
}

function buildGroceryItem() {
  var nameField = document.getElementById('field-add-item');
  var quantityField = document.getElementById('field-quantity');
  var item = { name: nameField.value, quantity: quantityField.value, price: 'unassigned' };
  return item;
}

function addItemToDOM(currentItem){
  displayActiveADDButton();
  createItemRow(currentItem);
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

function deleteItemFromDOM(){
  debugger;
  var item = document.getElementById('');
}

function createItemRow(item){  
  var table = document.querySelector('tbody');
  var row = table.insertRow();
  createCheckbox(item, row);
  createCellData(item, row);
}  

function createCheckbox(item, row){
  var itemCheckbox = document.createElement('input');
  var cell = row.insertCell();
  itemCheckbox.type = 'checkbox';
  itemCheckbox.id = item.name;
  itemCheckbox.classList.add('ckbx-styled');
  cell.appendChild(itemCheckbox);
  itemCheckbox.addEventListener('change', function(){ 
    countItems();
    updateCost(item, 'add')   
  })
}

function createCellData(item, row){
  var itemData = Object.values(item);
  itemData.forEach(el => {
    let cell = row.insertCell();
    if (el == 'unassigned') {;
      createPriceButton(itemData[0], cell);
    } else {
      let text = document.createTextNode(el);
      cell.appendChild(text);
    }
  })  
}

function createPriceButton(item, cell){
  debugger;
  var priceButton = buildInput('button', `${item}-price`, 'Add Price', createPriceField)
  cell.appendChild(priceButton);
}

function createPriceField(item, cell){
  var priceField = buildInput('text', 'item-price-field', '');
  var savePriceButton = buildInput('button', `save-${item}-price`, 'Save', savePrice)

  cell.innerHTML = '';
  cell.appendChild(priceField);
  cell.appendChild(savePriceButton); 
}

function addPriceToDOM(){
  var itemPrice = document.getElementById('item-price-field').value
  //for (const element of groceryList){
  //  var item;
  //  if (element.name == item){ element.price = itemPrice; }
  //}
  cell.innerHTML = '$' + itemPrice; 
}

function updateTable(operation){
  var groceryList = manageGroceryList('listAll');
  countItems(groceryList);
  updateCost(groceryList, operation);
}

function updateDOMItemCount(){}
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
function addItem(){
  var currentItem = buildGroceryItem();
  manageGroceryList('addItem', currentItem) 
  addItemToDOM(currentItem);
  clearField('field-add-item')
  clearField('field-quantity')
}

function deleteItem(){
  deleteItemFromDOM();
  manageGroceryList('deleteItem', currentItem)
}

function savePrice(){
  var price = udefined;
  var currentItem = undefined;
  manageGroceryList('addPrice', currentItem, price);
  addPriceToDOM();
}

function addTotalPrice(){
  var price = calculateCost();
  updateDOMCost(price);
}

function addTotalCount(){
  var count = countItems();
  updateDOMItemCount(count);
} 

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

// factory functions
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
  var groceryList = [];
  directGroceryListAction(action, item, num);

/********************************************************** */

  function directGroceryListAction(action, item, num) {
    switch (action){
    case 'addItem': 
      groceryList = addItemToGroceryList(item);
      break;

    case 'deleteItem':
      groceryList = deleteItemFromGroceryList(item);
      break;

    case 'addQuantity':
      groceryList =  addQuantity(item, num);
      break;

    case 'addPrice':
      groceryList = addPrice(item, num);
      break;

    case 'resetList':
      groceryList = resetListGroceryList();
      break;  

    default: 
      groceryList;  
    } 
  }

  function addItemToGroceryList(item){
    let newItem = {name: item.name, quantity: item.quantity, price: undefined}
    groceryList.push(newItem)
    return groceryList;
  }

  function deleteItemFromGroceryList(item){
    groceryList.forEach((el, itemToDelete) => {
      if (el.name === itemToDel){
        //remove from groceryList object
        //update table, count, and total cost
      }
    })
    return groceryList;
  }

  function resetGroceryList(){}
}

// LOGIC AND CALCULATIONS 

// count items
function countItems(){
  // create closure to access groceryList without passing as parameter
  var checkboxes = Array.from(document.getElementsByClassName('ckbx-styled'))
  var checked = []
  var count = function countCheckboxes(){
    for (const element of checkboxes) { 
      if (element.checked == true) {   
        let quantity = element.offsetParent.nextElementSibling.nextElementSibling.textContent.substr(2)
        checked.push(parseInt(quantity, 10));
      }
    }
    return checked.reduce(add, 0);
  }    

  document.getElementById('items-num').innerText = count;
  
  function add(total, num) {
    return total + num;
  }
}

// calculate cost
function calculateCost(){}

// add tax
function calculateTax(){}

// convert currency 
function convertCurrency(){}



