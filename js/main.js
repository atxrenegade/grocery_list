initialize(); 

//*****************************************************************
function initialize(){
  // add event listeners to buttons
  document.getElementById('btn-add-item').addEventListener('click', addItem);
  document.getElementById('btn-del-item').addEventListener('click', deleteItem);
  document.getElementById('btn-reset').addEventListener('click', resetList);
}

function addItem(){
  var inputField = document.getElementById('field-add-item');
  var groceryList = [];

  if (inputField == null) {
    createItemField('field-add-item');
    document.getElementById('btn-save').addEventListener('click', saveItem);
  } 

  function saveItem(event){
    let name = event.target.previousElementSibling.value;
    event.target.previousElementSibling.value = '';
    let item = { name: name, cost: undefined, price: undefined };
    groceryList.push(item);
    console.log(groceryList);
    countItems(groceryList);
    updateCost(groceryList, 'add');
  }
  //name, quantity, cost
  //displayList, cost and count
 
}

function createItemField(fieldType){
  var itemField = document.createElement('input');
  var saveButton = document.createElement('button');
  var elToAppendTo = document.getElementById('grocery-items');

  itemField.type = 'text';
  itemField.id = fieldType;

  saveButton.id = 'btn-save';
  saveButton.innerText = 'SAVE';

  elToAppendTo.appendChild(itemField);
  elToAppendTo.appendChild(saveButton);
}

function updateCost(groceryList, operationToPerform) {
  
  // update cost by adding or removing item
}

function countItems(groceryList){
  // create clossure to access groceryList without passing as parameter
  var count = groceryList.length;
  document.getElementById('items-num').innerText = count;
  // total items by count and quantity
}

function displayList(){
  // display table of grocery items with name, quantity, cost and checkbox
}

function deleteItem(item){
  // delete item
  // update cost
  // display new table
}

function resetList(){
  groceryList = [];
  cost = 0;
  document.getElementById('grocery-items').innerHTML = '<br><br>'; 
  document.getElementById('total-cost').innerText = 0;
  document.getElementById('items-num').innerText = 0;
}
