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

function addItem(){
  var inputField = document.getElementById('field-add-item');
  var groceryList = [];
  if (inputField == null) {
    createItemField('field-add-item');
    document.getElementById('btn-save').addEventListener('click', saveItem);
  } 

  /***************************/
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
    createCheckbox(item, row);
    createCellData(item, row);
  }  

  function createCheckbox(item, row){
    debugger;
    var itemCheckbox = document.createElement('input');
    var cell = row.insertCell();
    itemCheckbox.type = 'checkbox';
    itemCheckbox.id = item.name;
    itemCheckbox.classList.add('ckbx-styled');
    cell.appendChild(itemCheckbox);
    itemCheckbox.addEventListener('change', function(){ 
      if (this.checked){ 
        countItems();
        updateCost(item, 'add') 
      } 
    })
  }

  function createCellData(item, row){
    var itemData = Object.values(item);
    itemData.forEach(el => {
      let cell = row.insertCell();
      let text = document.createTextNode(el);
      cell.appendChild(text);
    })   
  } 
}

function updateTable(groceryList, operation){
  countItems(groceryList);
  updateCost(groceryList, operation);
}

function updateCost(item, operationToPerform){
  // update cost by adding or removing item
}

function countItems(groceryList){
  // create closure to access groceryList without passing as parameter
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
  document.getElementById('grocery-items-section').innerHTML = ''; 
  document.getElementById('total-cost').innerText = 0;
  document.getElementById('items-num').innerText = 0;
}
