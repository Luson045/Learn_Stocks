// backend/server.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const Orgroutes = require('./routes/orgs');
const BSroutes = require('./routes/buynsell');
const Stock = require('./models/org');
const All = require('./models/all')
const mongoose = require('mongoose');
const cron = require('node-cron');
const finnhub = require('finnhub');
request = require('request');
const dotenv = require('dotenv');
const stockNseIndia = require('stock-nse-india');
const NseIndia = stockNseIndia.NseIndia;
const  nseIndia = new NseIndia();
const moment = require('moment-timezone');
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

const app = express();
//middleware to use public folder
app.use(express.static('public'))
const PORT = process.env.PORT || 5000;
//const AV_URL ='';
const corsOptions = {
  origin: ['https://learnstocks.netlify.app','https://console.cron-job.org/'], // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.DB_URL;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
     // Add more as needed

const stockSymbol = [
  "AAPL","MSFT","NVDA","GS","META","GOOG","TSLA","AMZN"
]
const stockSymbols = [
    "20MICRONS",
    "360ONE",
    "RELIANCE",
    "BAJAJ-AUTO",
    "BAJAJELEC",
    "BHEL",
    "BIKAJI",
    "BIRLACORPN",
    "AADHARHFC",
    "AAKASH",
    "AAREYDRUGS",
    "CAMPUS",
    "AARTIDRUGS",
    "SAFARI",
    "DRREDDY",
    "EVEREADY",
    "FLAIR",
    "SAPPHIRE",
    "HCLTECH",
    "SIGMA",
    "INDIAMART",
    "INDIGO",
    "INDIGOPNTS",
    "INFY",
    "IPL",
    "IRIS",
    "ITC",
    "ACC",
    "MARUTI",
    "MRF",
    "NDTV",
    "NESTLEIND",
    "OIL",
    "TATASTEEL",
    "TCS",
    "TATAMOTORS",
    "TVSMOTOR",
    "WHIRLPOOL",
    "ZOMATO",
    "ZEEMEDIA"
  ];
/*nseIndia.getAllStockSymbols().then(async (symbols)  =>  {
  const all =  await All.findById('668bc035b68fc5703181a4aa');
  all.names=stockSymbols;
  await all.save();
  console.log("saved!");
})*/
// Function to update database with new stock data
function isMarketOpen() {
  // Get current time in GMT
  const now = moment().tz('GMT');

  // Get current day of the week (0 = Sunday, 1 = Monday, ...)
  const currentDay = now.day();

  // Check if it's a weekday (Monday to Friday)
  if (currentDay >= 1 && currentDay <= 5) {
    // Indian Market Time (IST: 09:15 AM to 03:30 PM)
    // Convert to GMT: 03:45 AM to 10:00 AM GMT
    const indianMarketOpen = moment.tz('03:45', 'HH:mm', 'GMT');
    const indianMarketClose = moment.tz('10:00', 'HH:mm', 'GMT');

    // American Market Time (EST: 09:30 AM to 04:00 PM)
    // Convert to GMT: 14:30 PM to 21:00 PM GMT
    const americanMarketOpen = moment.tz('14:30', 'HH:mm', 'GMT');
    const americanMarketClose = moment.tz('21:00', 'HH:mm', 'GMT');

    // Check if current time is within Indian market hours
    if (now.isBetween(indianMarketOpen, indianMarketClose)) {
      return 'Indian';
    }

    // Check if current time is within American market hours
    if (now.isBetween(americanMarketOpen, americanMarketClose)) {
      return 'American';
    }
  }

  return 'closed';
}

const market=isMarketOpen();
console.log(market);

//console.log("symbolss:",stockSymbols);
//continuous fetching of data
async function fetchStockData(symbol) {
  const convertToDatetime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Convert to local date-time string format
  };
  //console.log(symbol);
  try {
    // Fetch the intraday data
    const data = await nseIndia.getEquityIntradayData(symbol, false);

    // Log the last element of the grapthData array
    const startindex =parseInt(data.grapthData.length*(0.8));
    const lastElement = data.grapthData[data.grapthData.length - 1];
    const seclast = data.grapthData[startindex];
    //console.log("pl: ",seclast[1]===0?lastElement[1]:((lastElement[1]-seclast[1])/seclast[1])*100);

    // Find the existing stock entry
    const org = await Stock.findOne({ symbol });
    const historical_data = data.grapthData.map(item => ({ datetime: convertToDatetime(item[0]), price: item[1] }));
    if (org) {
        //console.log(`Found an entry! ${org.symbol}`);

        // Update existing entry
        org.org_name = symbol;
        org.current_price = lastElement[1];
        org.pl = data.grapthData[0][1]===0?lastElement[1]:((lastElement[1]-data.grapthData[0][1])/data.grapthData[0][1])*100; // This seems to always be 0, review if this is the intended calculation
        
        // Ensure historical_data is an array
        if (!Array.isArray(org.historical_data)) {
            org.historical_data = [];
        }
        
        // Update historical_data
        org.historical_data = historical_data.slice(startindex,data.grapthData.length - 1);
        
        // Save updated entry
        await org.save();
        //console.log("Saved successfully");
    } else {
        //console.log("Couldn't find an existing entry!");
        // Create a new stock entry
        const newstock = new Stock({
            org_name: symbol,
            symbol: symbol,
            current_price: lastElement[1],
            pl: data.grapthData[0][1]===0?lastElement[1]:((lastElement[1]-data.grapthData[0][1])/data.grapthData[0][1])*100, // Review this calculation
            historical_data: historical_data.slice(startindex,data.grapthData.length - 1),
        });

        // Save the new stock entry
        await newstock.save();
        //console.log("Saved successfully");
    }
  }catch (error) {
    // Handle errors that may occur during the asynchronous operations
    //console.error("Error updating stock data:", error);
  }
}


// Schedule data fetching every minute
async function fetchAndUpdateStocks() {
  for (var i = 0; i < stockSymbols.length; i++){
    try{
      //console.log("stockname:",stockSymbols[i]);
      await fetchStockData(stockSymbols[i]);
    } catch (error) {
      //console.error('Error in fetch and update cycle:', error.message);
    }
  }
}

// Fetch data every 2 minutes
if (market==='Indian'){
  cron.schedule('*/2 * * * *', fetchAndUpdateStocks);
}
cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
  try {
      await User.deleteMany({ 
          isVerified: false,
          verificationExpires: { $lt: Date.now() }
      });
      console.log('Deleted expired unverified users');
  } catch (error) {
      console.error('Error deleting expired unverified users:', error);
  }
});
// Use the routes defined in the routes folder
app.use('/api/orgs', Orgroutes);
app.use('/api/bs', BSroutes);
app.use('/api', routes);
app.get('/ping', async (req,res)=>{
  res.send("Ping 200");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
