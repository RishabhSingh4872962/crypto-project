const table = document.getElementById("currency");
let cryptoArr;
async function fetchData() {
  const apiData = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
  );
  const cryptoData = await apiData.json();
  cryptoArr = cryptoData;
  renderCrypto(cryptoData);
}
fetchData();

function handleSort() {
  console.log(this.event.target.innerText);
  if (this.event.target.innerText == "Sort by Mkt Cap") {
    cryptoArr.sort((a, b) => {
      return b.market_cap - a.market_cap;
    });
  } else {
    cryptoArr.sort((a, b) => {
      return b.price_change_percentage_24h - a.price_change_percentage_24h;
    });
  }

  table.innerHTML = "";
  renderCrypto(cryptoArr);
}
let bounce = debouncing();
function handleChange() {
  bounce(this.event.target.value);
}

function debouncing() {
  let id;
  return function (value) {
    if (id) {
      clearTimeout(id);
    }
    id = setTimeout(
      function (val) {
        if (val) {
          cryptoArr.sort((a, b) => {
            let name1 = a.name.toLowerCase();
            let name2 = b.name.toLowerCase();

            let sym1 = a.symbol.toLowerCase();
            let sym2 = b.symbol.toLowerCase();
            if (
              (name1.match(val) && name2.match(val) == null) ||
              (sym1.match(val) && sym2.match(val) == null)
            ) {
              return -1;
            } else if (
              (name2.match(val) && name1.match(val) == null) ||
              (sym2.match(val) && sym1.match(val) == null)
            ) {
              return 1;
            }
            return 0;
          });

          console.log("run");
          table.innerHTML = "";
          renderCrypto(cryptoArr);
        }
      },
      800,
      value
    );
  };
}

function renderCrypto(crypto) {
  crypto.forEach((cryptoCurrency, i) => {
    const png = document.createElement("img");
    png.src = cryptoCurrency.image;
    png.width = 30;
    png.height = 30;
    const name = document.createElement("span");
    name.textContent = cryptoCurrency.name;

    const symbol = document.createElement("span");
    symbol.textContent = cryptoCurrency.symbol;

    const currentPrice = document.createElement("span");
    currentPrice.textContent = `$${
      cryptoCurrency.current_price.type == "Big Number"
        ? cryptoCurrency.current_price.value.split("n")[0]
        : cryptoCurrency.current_price
    }`;

    const total_volume = document.createElement("span");
    total_volume.textContent = `$${cryptoCurrency.total_volume}`;

    const percentageChange = document.createElement("span");
    percentageChange.style.color =
      cryptoCurrency.price_change_percentage_24h < 0.0 ? "red" : "green";
    percentageChange.textContent = `${cryptoCurrency.price_change_percentage_24h}%`;

    const market_cap = document.createElement("span");
    market_cap.textContent = `Mkt Cap :$${cryptoCurrency.market_cap}`;

    const row = table.insertRow(i);

    row.insertCell(0).appendChild(png);
    row.insertCell(1).appendChild(name);
    row.insertCell(2).appendChild(symbol);
    row.insertCell(3).appendChild(currentPrice);
    row.insertCell(4).appendChild(total_volume);
    row.insertCell(5).appendChild(percentageChange);
    row.insertCell(6).appendChild(market_cap);
  });
}
