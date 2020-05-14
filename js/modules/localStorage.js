export { createNewList, buildSavedList, manageGroceryList };

function createNewList() {
  var groceryArray = [];
  localStorage.setItem('groceryArray', JSON.stringify(groceryArray));
}

function buildSavedList() {
  return JSON.parse(localStorage['groceryArray']);
}

function manageGroceryList(action, item, num){
  directGroceryListAction(action, item, num);

/********************************************************** */

  function directGroceryListAction(action, item, num) {
    switch (action){
    case 'addItem': 
      var newItem = { name: item.name, quantity: item.quantity, price: 'unassigned' };
      addItemToSavedList(newItem);
      break;
    case 'updateItem':
      updateSavedItem(item, num);
      break;
    case 'deleteItem':
      deleteItemFromSavedList(item);
      break;
    case 'resetList':
      deleteSavedList();
      break;  
    default: 
        return retrieveSavedList();  
    } 
    return retrieveSavedList();
  }

  /*Local Storage Functions *****************************************/
  // add item
  function addItemToSavedList(newItem){
    var retrievedArray = retrieveSavedList();
    retrievedArray.push(newItem);
    var newArray = JSON.stringify(retrievedArray);
    localStorage.setItem('groceryArray', newArray);
  }

  // delete item
  function deleteItemFromSavedList(itemToDelete){
    var retrievedArray = retrieveSavedList();
    var elIndex = retrievedArray.findIndex(el => (el.name === itemToDelete))
    retrievedArray.splice(elIndex, 1);
    localStorage.setItem('groceryArray', JSON.stringify(retrievedArray));
  }
  // retrieveSavedList 
  function retrieveSavedList(){
    return JSON.parse(localStorage.getItem('groceryArray'));
  }

  // delete saved list
  function deleteSavedList(){
    localStorage.clear();
  }

  function updateSavedItem(itemToUpdate, num){
    var retrievedArray = retrieveSavedList();
    var elIndex = retrievedArray.findIndex(el => (el.name === itemToUpdate));
    retrievedArray[elIndex]['price'] = num;
    localStorage.setItem('groceryArray', JSON.stringify(retrievedArray));
  }
}
