initialize(); 

//*****************************************************************
function initialize(){
  // add event listeners to buttons
  document.getElementById('btn-add-item').addEventListener('click', addItem)
  document.getElementById('btn-del-item').addEventListener('click', deleteItem)
  document.getElementById('btn-reset').addEventListener('click', resetList)
}

function addItem(name, quantity, cost){
  //create item field with button and event listener
  //get data from event
  //adds button with event listener to append new items to list
  //invokes updateCost
  //invokes countItem
  //displaylist, cost and count
}

function createItemField(){
  //create fields with save button
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
