const inputElement = document.getElementById("inputElement");
  const open = document.querySelector(".open");
  const high = document.querySelector(".high");
  const low = document.querySelector(".low");
  const close = document.querySelector(".close");
  const volume = document.querySelector(".vol");
  const qav = document.querySelector(".qav");
  const trades = document.querySelector(".trades");
  const bav = document.querySelector(".bav");
  const buttons = document.querySelectorAll('.button-area button');
  const log = console.log;
  const domElement = document.getElementById('tvchart');
  const coinName = document.querySelector(".coin-name")
  const heartButton = document.querySelector('.heart-btn');
  const watchList = document.querySelector('.watch-list');
  const Stocks = document.querySelectorAll("#inputElement option")
const logout = document.querySelector(".logout")



logout.addEventListener("click",()=>{
  localStorage.removeItem('token')
  window.location.href="http://localhost:2000/"
})
  var chart = LightweightCharts.createChart(document.getElementById('tvchart'), {
    width: window.innerWidth * 0.5,
    height: window.innerHeight * 0.6,
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
    layout: {
      fontFamily: 'Arial,sans-serif',
      fontSize: 12,
      textColor: '#ffffff',
      background: {
        color: '#121418'
      },
    },
    grid: {
      vertLines: {
        color: 'rgba(67, 67, 67,0.2)',
      },
      horzLines: {
        color: 'rgba(67, 67, 67,0.2)',
      },
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },

    timeScale: {
      borderColor: 'rgba(197, 203, 206, 0.8)',
      timeVisible: true,
      borderVisible: true,
      secondsVisible: false,
    },
  });

  function resizeChart() {
    chart.resize(window.innerWidth * 0.6, window.innerHeight * 0.6);
  }

  window.addEventListener('resize', resizeChart);
  window.addEventListener('load', resizeChart);

  const candleSeries = chart.addCandlestickSeries();
  candleSeries.applyOptions({
    upColor: 'rgb(14, 203, 129)', // change as needed
    downColor: 'rgb(246, 70, 93)', // change as needed
    wickUpColor: 'rgb(14, 203, 129)', // change as needed
    wickDownColor: 'rgb(246, 70, 93)', // change as needed
    borderVisible: false,
    borderUpColor: '#00ff00', // change as needed
    borderDownColor: 'rgb(246, 70, 93)',
  });
  let counter = 0;
  const intervalInSeconds = 1;






  // const selectedButton = document.querySelector('.button-area button.selected');


  let buttonValue = "1m";
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      buttonValue = button.innerHTML
      log(buttonValue)
    });
  });

  inputElement.value = "BTCUSDT";
  coinName.innerHTML =  "BTCUSDT"

const searchStocks = async () => {
    const inputData = inputElement.value;
    coinName.innerHTML = inputData
   await fetch(`https://api.binance.com/api/v3/klines?symbol=${inputData}&interval=${buttonValue}&limit=1000`)
      .then(res => res.json())
      .then(data => {
        const cdata = data.map(d => {
          const Timestamp = (d[0] / 1000) + 19800;
          const Open = parseFloat(d[1]).toFixed(4);
          const High = parseFloat(d[2]).toFixed(4);
          const Low = parseFloat(d[3]).toFixed(4);
          const Close = parseFloat(d[4]).toFixed(4);
          const Volume = parseFloat(d[5]).toFixed(4);
          const QAV = parseFloat(d[7]).toFixed(4);
          const Trades = d[8];
          const BAV = parseFloat(d[9]).toFixed(4);
          open.innerHTML = Open
          high.innerHTML = High
          low.innerHTML = Low
          close.innerHTML = Close
          volume.innerHTML = Volume
          qav.innerHTML = QAV
          trades.innerHTML = Trades
          bav.innerHTML = BAV
          return { time: Timestamp, open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]) }
        });
        candleSeries.setData(cdata);
      })
      .catch(err => log(err))
      checkWatchList(coinName.innerHTML)
  }

  const callSearchStocks = () => {
    searchStocks();
    counter++;
  }

  callSearchStocks();
  const intervalId = setInterval(callSearchStocks, intervalInSeconds * 1000);


  const tooken = localStorage.getItem('token')
  console.log(tooken);


  function toggleHeartBackground() {
    const currentBackground = heartButton.style.backgroundImage;

  if (currentBackground.includes("empty_heart")) {
    heartButton.style.backgroundImage = "url('./images/filled_heart1.png')";
    createWatchItemOnClient(coinName.innerHTML)
  } else if (currentBackground.includes("filled_heart")) {
    heartButton.style.backgroundImage = "url('./images/empty_heart1.png')";
    deleteWatchList(coinName.innerHTML)
  } else {
    // Handle other cases or default behavior
  }
}

const deleteWatchList = async (name) => {
  try {
    const response = await fetch(`http://localhost:2000/watchlist/${name}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
    });
    if (response.ok) {
      const data = await response.json();
      const watchItems = watchList.querySelectorAll('.watch-item');
      watchItems.forEach(item => {
        if (item.textContent === name) {
          item.remove(); // Remove the specific item from the watchlist
        }
      });
      // Update heart button background if the coin is not in the watchlist
      if (!data.includes(coinName.innerHTML)) {
        heartButton.style.backgroundImage = "url('./images/empty_heart1.png')";
      }
    } else {
      console.error('Failed to fetch watchlist');
    }
  } catch (error) {
    console.error('Error fetching watchlist', error);
  }
};

function createWatchItemOnClient(name) {
  fetch("http://localhost:2000/watchlist/", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify({ name: name })
  })
  .then(response => response.json())
  .then(data => {
      console.log(data); // Log the created watch item
      const watchItem = document.createElement('div');
      watchItem.classList.add('watch-item');
      watchItem.textContent = data.name;
      watchList.appendChild(watchItem);
      // Update heart button background as the coin is now in the watchlist
      heartButton.style.backgroundImage = "url('./images/filled_heart1.png')";
  })
  .catch(error => {
      console.error('Error:', error);
  });
}


  const getWatchList = async () => {
  try {
    const response = await fetch('http://localhost:2000/watchlist/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
    });
    if (response.ok) {
      const watchlist = await response.json();
      watchlist.forEach(item => {
        const watchItem = document.createElement('div');
        watchItem.classList.add('watch-item');
        watchItem.textContent = item;
        watchList.appendChild(watchItem);
      });

      const isCoinInWatchlist = watchlist.includes(coinName.innerHTML);
        if (isCoinInWatchlist) {
          heartButton.style.backgroundImage = "url('./images/filled_heart1.png')";
        } else {
          heartButton.style.backgroundImage = "url('./images/empty_heart1.png')";
        }
    } else {
      console.error('Failed to fetch watchlist');
    }
  } catch (error) {
    console.error('Error fetching watchlist', error);
  }
};


const checkWatchList = async (name) => {
  try {
    const response = await fetch(`http://localhost:2000/watchlist/${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
    });
    if (response.ok) {
      const data = await response.json()
      if (data==true) {
        heartButton.style.backgroundImage = "url('./images/filled_heart1.png')";
      } else {
        heartButton.style.backgroundImage = "url('./images/empty_heart1.png')";
      }
      console.log(data)
    } else {
      console.error('Failed to fetch watchlist');
    }
  } catch (error) {
    console.error('Error fetching watchlist', error);
  }
};


window.addEventListener('load', getWatchList);

heartButton.addEventListener('click', toggleHeartBackground);



watchList.addEventListener('click', (event) => {
  if (event.target.classList.contains('watch-item')) {
    const clickedItemName = event.target.textContent;
    inputElement.value = clickedItemName;
    searchStocks(clickedItemName);
  }
});
