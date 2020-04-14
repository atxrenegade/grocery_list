initialize(); 

//*****************************************************************
function initialize(){
  // add event listeners to buttons
  document.getElementById('btn-add-item').addEventListener('click', addItem);
  document.getElementById('btn-del-item').addEventListener('click', deleteItem);
  document.getElementById('btn-reset').addEventListener('click', resetList);
}

function addItem(){
  if (inputField == null) {
    createItemField('field-add-item');
    document.getElementById('btn-save').addEventListener('click', saveItem);
  } 

  function saveItem(event){
    let name = event.target.previousElementSibling.value;
    let item = { name: name, cost: undefined, price: undefined };
    groceryList.push(item);
    console.log(groceryList)
  }

    
  //name, quantity, cost
  //create item field with button
  //add event listener
  //get data from event
  //adds button with event listener to append new items to list
  //invokes updateCost
  //invokes countItem
  //displayList, cost and count
  var inputField = document.getElementById('field-add-item');
  var groceryList = [];
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

function updateCost(itemSum, operationToPerform) {
  
  // update cost by adding or removing item
}

function countItems(){
  // total items by count and quantity
}

function displayList(){
  // display table of grocery items
}

function deleteItem(item){
  // delete item
  // update cost
  // display new table
}

function resetList(){
  document.getElementById('grocery-items').innerHTML = '<br><br>'; 
  groceryList = [];
  cost = 0;
  numOfItems = 0;
}
