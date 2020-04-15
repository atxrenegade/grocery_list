initialize(); 
buildTable();

//*****************************************************************
function initialize(){
  // add event listeners to buttons
  document.getElementById('btn-add-item').addEventListener('click', addItem);
  document.getElementById('btn-del-item').addEventListener('click', deleteItem);
  document.getElementById('btn-reset').addEventListener('click', resetList);
}

function buildTable(){
  var elToAppendTo = document.getElementById('grocery-items-section')
  var groceryTable = document.createElement('table')
  groceryTable.classList.add('table');
  elToAppendTo.appendChild(groceryTable);
  var groceryBody = document.createElement('tbody')
  groceryTable.appendChild(groceryBody)
}

function addItem(){
  var inputField = document.getElementById('field-add-item');
  var groceryList = [];

  if (inputField == null) {
    createItemField('field-add-item');
    document.getElementById('btn-save').addEventListener('click', saveItem);
  } 

  function saveItem(event){
    var name = event.target.previousElementSibling.value;
    event.target.previousElementSibling.value = '';
    var item = { name: name, cost: undefined, price: undefined };
    groceryList.push(item);
    displayItem(item, groceryList);
    updateTable(groceryList, 'add');
  }

  function displayItem(item, groceryList){  
    console.log(groceryList);
    var table = document.querySelector('table');
    var row = table.insertRow();
    var itemData = Object.values(item);
    debugger;
    itemData.forEach(el => {
      let cell = row.insertCell();
      let text = document.createTextNode(el);
      cell.appendChild(text);
    })   
  }
  //name, quantity, cost
  //displayList, cost and count
}

function updateTable(groceryList, addOrDelete){
  countItems(groceryList);
  updateCost(groceryList, addOrDelete);
}

function createItemField(fieldType){
  var itemField = document.createElement('input');
  var saveButton = document.createElement('button');
  var elToAppendTo = document.getElementById('add-items-section');

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


function deleteItem(item){
  // delete item
  // update cost
  // display new table
}

function resetList(){
  groceryList = [];
  cost = 0;
  document.getElementById('grocery-items').innerHTML = ''; 
  document.getElementById('total-cost').innerText = 0;
  document.getElementById('items-num').innerText = 0;
}
