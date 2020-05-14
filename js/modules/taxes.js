export { toggleTaxes };

function toggleTaxes(CACHE) {
  var taxRate = CACHE.taxRate();
  var addTaxCheckBox = document.getElementById('tax-rate-checkbox');

  if (!taxRate) {
    if (document.getElementById('tax-rate-input-field')) {
      let newTaxRate = parseFloat(document.getElementById('tax-rate-input-field').value);
      CACHE.taxRate(newTaxRate);
    }
  }

  if (taxRate > 0.01) {
    let taxEl = document.getElementById('rate-row-cell-1');
    let totalPrice = CACHE.totalPrice();
    // check if tax rate present and total price is greater than zero
    if (addTaxCheckBox.checked && totalPrice > 0) {
      // check if checkbox is checked to add taxes to total
      taxEl.innerText = `Taxes: $${taxOfTotal().toFixed(2)} @ ${taxRate}%`;
      addOrSubtractTaxFromTotal('add');
      // check if checkbox is unchecked to delete taxes from
    } else if (!(addTaxCheckBox.checked) && totalPrice > 0) {
      addOrSubtractTaxFromTotal('subtract');
    } else {
      // to add tax rate to DOM when total price is still zero
      taxEl.innerHTML = `Tax Rate: ${taxRate}%`;
    }

    /************************************* */
    function addOrSubtractTaxFromTotal(operator) {
      var total;
      var price = CACHE.totalPrice();
      operator == 'add' ? total = taxOfTotal() + price : total = price;
      CACHE.element.price.innerText = `${total.toFixed(2)}`;
    }

    function taxOfTotal() {
      return calculateRate(CACHE.totalPrice(), CACHE.taxRate() / 100);
    }

    function calculateRate(total, rate) {
      var numWithRate = (total * rate);
      return Math.round(numWithRate * 100) / 100;
    }
  }
}



