export { convertCurrency };

function convertCurrency(CACHE) {
  var currencyArray = retrieveUserInput().split(',');
  var total = parseFloat(CACHE.element.price.innerText, 10);
  calculateAndAppendConverted(currencyArray, total);


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
    var currencyRates = data.conversion_rates;
    var currency = currencyArray[1].toUpperCase();
    var rate = currencyRates[`${currency}`];
    return rate;
  }

  function calculateExchangedTotal(rate) {
    var price = parseFloat(CACHE.element.price.innerText, 10);
    var totalExchanged = calculateRate(price, rate);
    return totalExchanged;
  }

  function appendToDOM(totalExchanged) {
    var elToAppendTo = document.getElementById('rate-row-cell-3');
    elToAppendTo.innerHTML = `The total is ${totalExchanged} ${currencyArray[1].toUpperCase()}, converted from ${currencyArray[0].toUpperCase()}.`;
  }

  function calculateRate(total, rate) {
    var numWithRate = (total * rate);
    return Math.round(numWithRate * 100) / 100;
  }
}