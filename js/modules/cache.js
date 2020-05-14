export { setCACHE }

function setCACHE() {
  var cache = {};

  function cacheData(data, cacheName) {
    if (data) { cache[cacheName] = data };
    return cache[cacheName];
  };

  return {
    totalPrice: function (data) { return cacheData(data, 'totalPrice') },
    taxRate: function (data) { return cacheData(data, 'taxRate') },
    element: {
      price: document.getElementById('cost-num')
    }
  }
}
