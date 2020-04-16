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
  var itemQuantity = document.createElement('input');
  var saveButton = document.createElement('button');
  var elToAppendTo = document.getElementById('add-items-section');

  itemField.type = 'text';
  itemField.id = fieldType;
  itemField.value = 'item'
  itemField.addEventListener('click', function(){itemField.value = ''})

  itemQuantity.type = 'text';
  itemQuantity.id = 'field-quantity';
  itemQuantity.value = 'quantity';
  itemQuantity.addEventListener('click', function(){itemQuantity.value = ''})

  saveButton.id = 'btn-save';
  saveButton.innerText = 'SAVE';

  elToAppendTo.appendChild(itemField);
  elToAppendTo.appendChild(itemQuantity);
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
  function saveItem(){
    var nameField = document.getElementById('field-add-item') ;
    var quantityField = document.getElementById('field-quantity');
    
    var item = { name: nameField.value, quantity: 'x ' + quantityField.value, price: undefined };
    nameField.value = '';
    quantityField.value = '';
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

function countItems(){
  // create closure to access groceryList without passing as parameter
  var checkboxes = Array.from(document.getElementsByClassName('ckbx-styled'))
  var checked = []
  for (const element of checkboxes) { 
    if (element.checked == true) {   
      let quantity = element.offsetParent.nextElementSibling.nextElementSibling.textContent.substr(2)
      checked.push(parseInt(quantity, 10));
    }
  }
  var count = checked.reduce(add, 0)
  document.getElementById('items-num').innerText = count;

  function add(total, num) {
    return total + num;
  }
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
  document.getElementById('cost-num').innerText = 0;
  document.getElementById('items-num').innerText = 0;
}
