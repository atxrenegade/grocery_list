initialize(); 

//*****************************************************************
function initialize(){
  void function addEventListeners(){
    document.getElementById('btn-add-item').addEventListener('click', addItem);
    document.getElementById('btn-del-item').addEventListener('click', deleteItem);
    document.getElementById('btn-reset').addEventListener('click', resetList);
  }();
}

// DISPLAY DATA

//diplay table

//display row

//display cell

//display field

//display buttons


// MANAGE DATA

// create closure to store GroceryList variable
function manageGroceryList(action, item, num){
  if (groceryList == undefined){ var groceryList = []; }

  switch (action){
  case 'addItem': 
    groceryList = addItem(item);
    break;

  case 'deleteItem':
    groceryList = deleteItem(item);
    break;

  case 'addQuantity':
    groceryList =  addQuantity(item, num);
    break;

  case 'addPrice':
    groceryList = addPrice(item, num);
    break;

  case 'resetList':
    groceryList = resetList();
    break;  

  default: 
    groceryList;  
  }   
  countItems();
  updateCost();
  return groceryList;

  function addItem(item){
    let newItem = {name: item.name, quantity: item.quantity, price: undefined}
    groceryList.push(newItem)
    return groceryList;
  }

  function deleteItem(){}

  function addPrice(){}

  function addQuantity(){
  } 

  function resetList(){

  }
}

// LOGIC AND CALCULATIONS 

// count items

// calculate cost

// convert currency 


//BUILD TABLE CELLS
function buildAddItemElements(fieldType){
  var elToAppendTo = document.getElementById('edit-items-section');
  var itemField = buildInput('text', fieldType, 'item', clearValue);
  var itemQuantity = buildInput('text', 'field-quantity', 'quantity', clearValue);
  var saveButton = buildInput('button', 'btn-save', 'SAVE');
  var newElements = [itemField,itemQuantity, saveButton]
  newElements.forEach(el => elToAppendTo.appendChild(el))
}

function addItem(){
  void function displayActiveADDButton(){
    clearDiv('edit-items-section');
    var buttonStates = ['btn-add-item', 'btn-del-item', 'btn-reset']
    var inputField = document.getElementById('field-add-item');
    if (inputField == null) {
      buildAddItemElements('field-add-item');
      document.getElementById('btn-save').addEventListener('click', getUserInputItem);
    } 
    displayActiveButton(buttonStates);
  }();   
}

function getUserInputItem(){
  var nameField = document.getElementById('field-add-item') ;
  var quantityField = document.getElementById('field-quantity'); 
  var item = { name: nameField.value, quantity: quantityField.value, price: undefined };
  var groceryList = manageGroceryList('addItem', item);
  nameField.value = '';
  quantityField.value = '';
  
  displayItem(item);
  updateTable(groceryList, 'add');
}

function displayItem(item, groceryList){  
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

function addPriceButton(item, cell){
  var priceButton = buildInput('button', `${item}-price`, 'Add Price',
    addPriceField(item, cell))
  cell.appendChild(priceButton);
}

function addPriceField(item, cell){
  var priceField = buildInput('text', 'item-price-field', '');
  var savePriceButton = buildInput('button', `save-${item}-price`, 'Save', savePrice)

  cell.innerHTML = '';
  cell.appendChild(priceField);
  cell.appendChild(savePriceButton); 
 
  function savePrice(){
    var itemPrice = document.getElementById('item-price-field').value
    for (const element of groceryList){
      var item;
      if (element.name == item){ element.price = itemPrice; }
    }
    cell.innerHTML = '$' + itemPrice; 
  }
}

function createCellData(item, row){
  var itemData = Object.values(item);
  itemData.forEach(el => {
    let cell = row.insertCell();
    if (el == 'unassigned') {
      addPriceButton(itemData[0], cell);
    } else {
      let text = document.createTextNode(el);
      cell.appendChild(text);
    }
  })  
}


function updateTable(groceryList, operation){
  countItems(groceryList);
  updateCost(groceryList, operation);
}

function updateCost(item, operationToPerform){
  // update cost by adding or removing item
}

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

function deleteItem(item){
  clearDiv('edit-items-section');
  var buttonStates = ['btn-del-item', 'btn-add-item', 'btn-reset']
  var elToAppendTo = document.getElementById('edit-items-section');
  var deleteField = buildInput('text', 'field-delete-item', 'item to delete', clearValue)
  var deleteButton = buildInput('button', 'btn-field-del-item', 'Delete', removeFromGroceries)

  displayActiveButton(buttonStates);
  elToAppendTo.appendChild(deleteField);
  elToAppendTo.appendChild(deleteButton);
  
  function removeFromGroceries(){
    var itemToDel = document.getElementById('field-delete-item').value;
    clearDiv('edit-items-section');
    groceryList.forEach((el, itemToDelete) => {
      if (el.name === itemToDel){
        //remove from groceryList object
        //update table, count, and total cost
      }
    })
  }   
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

function clearValue(){
  this.value = '';
}

function clearDiv(id){
  document.getElementById(id).innerHTML = "";
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

function resetList(){
  var buttonStates = ['btn-reset', 'btn-add-item', 'btn-del-item']
  displayActiveButton(buttonStates);
  clearDiv('edit-items-section');
  clearDiv('grocery-items-section');
  document.getElementById('cost-num').innerText = 0;
  document.getElementById('items-num').innerText = 0;

  groceryList = [];
  cost = 0;

  intialize();
}


/******Seperate functionality into displaying data and managing data */