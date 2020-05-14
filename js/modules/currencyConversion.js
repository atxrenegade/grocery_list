export { convertCurrency, resetCurrencyElements };

function convertCurrency(CACHE) {
  var currencyArray = retrieveUserInput().split(',');
  calculateAndAppendConverted(currencyArray);

  /************************************************************** */  
  function retrieveUserInput() {
    var options = Array.from(document.getElementsByTagName('select')[0].children);
    return options.filter(returnSelectedValue)[0].value;

    function returnSelectedValue(option) {
      if (option.selected == true) { return option.value };
    }
  }

  function calculateAndAppendConverted(currencyArray) {
    try {
      fetchCurrencyRate(currencyArray[0]);
    } catch (error) {
      console.log(error);
    }
  }

  function fetchCurrencyRate(currency) {
    var url = `https://prime.exchangerate-api.com/v5/51b51bd8875d058d36d9986d/latest/${currency.toUpperCase()}`
    fetch(url)
      .then(response => response.json())
      .then(json => formatRate(json))
      .then(rate => calculateExchangedTotal(rate))
      .then(totalExchanged => appendToDOM(totalExchanged))
  }

  function formatRate(data) {
    debugger;
    var currencyRates = data.conversion_rates;
    var currency = currencyArray[1].toUpperCase();
    var rate = currencyRates[`${currency}`];
    return rate;
  }

  function calculateExchangedTotal(rate) {
    var price = CACHE.totalPrice();
    var totalExchanged = calculateRate(price, rate);
    return totalExchanged;
  }

  function calculateRate(total, rate) {
    var numWithRate = (total * rate);
    return Math.round(numWithRate * 100) / 100;
  }

  function appendToDOM(totalExchanged) {
    var elToAppendTo = document.getElementById('rate-row-cell-3');
    elToAppendTo.innerHTML = `The total is ${totalExchanged.toFixed(2)} ${currencyArray[1].toUpperCase()}, converted from ${currencyArray[0].toUpperCase()}.`;
  }
}

// reset currency element when new tax or items added to price;
function resetCurrencyElements() {
  let currencyCell = document.getElementById('rate-row-cell-3');
  if (currencyCell.innerText != 'Convert Currency') {
    currencyCell.innerText = 'Convert Currency'
    document.getElementById('currency-rate-checkbox').checked = false;
  };
}
