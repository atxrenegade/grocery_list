initialize(); 

//*****************************************************************
function initialize(){
  // add event listeners to buttons
  document.getElementById('btn-add-item').addEventListener('click', addItem)
  document.getElementById('btn-del-item').addEventListener('click', deleteItem)
  document.getElementById('btn-reset').addEventListener('click', resetList)
}

function addItem(){
  if (inputField == null) {
    createItemField('field-add-item')
    document.getElementById('btn-save').addEventListener('click', saveItem)
  } 

  var inputField = document.getElementById('field-add-item')
  function saveItem(event){
    debugger;
    var groceryList = []
    let name = event.target.previousElementSibling.value
    let item = {name: name, cost: undefined, price: undefined }
    groceryList.push(item)
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
}

function createItemField(fieldType){
  let itemField = document.createElement('input')
  let saveButton = document.createElement('button')
  let elToAppendTo = document.getElementById('grocery-items')

  itemField.type = 'text';
  itemField.id = fieldType;

  saveButton.id = 'btn-save'
  saveButton.innerText = 'SAVE'

  elToAppendTo.appendChild(itemField)
  elToAppendTo.appendChild(saveButton)
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
  //if groceryList === notdefined {
    //add message 'List is already Empty'
  //} else {
    // delete list
    // set cost to 0
    // set items to 0
  //}
}
