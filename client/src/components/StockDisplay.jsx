import React, { useEffect, useState } from 'react';
import '../css/Stock.css';
import Chart from 'chart.js/auto';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment-timezone';
import getEnvironment from "../getenvironment";
 
// toast-configuration method,
// it is compulsory method.
import {
    LineChart,
    ResponsiveContainer,
    Legend,
    Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
} from "recharts";
//import { useNavigate } from 'react-router-dom';

const StockDisplay = () => {
    const apiUrl = getEnvironment();
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [userstocks, setuserstock] = useState(null);
    const [bought, setBought] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [current, setCurrent] = useState();
    const [loading,setLoading] = useState(false);
    const [marketStatus, setMarketStatus] = useState('');

    useEffect(() => {
      const checkMarketStatus = () => {
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
            setMarketStatus('');
            return;
          }
  
          // Check if current time is within American market hours
          if (now.isBetween(americanMarketOpen, americanMarketClose)) {
            setMarketStatus('Indian Market is closed right now!');
            return;
          }
        }
  
        setMarketStatus('Market is Currently Closed');
      };
  
      // Check status immediately
      checkMarketStatus();
  
      // Set up interval to check status every minute
      const intervalId = setInterval(checkMarketStatus, 60000);
  
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }, []);
    const dummy = [
        {
            name: "Select",
            student: 11,
            fees: 120,
        },
        {
            name: "A",
            student: 15,
            fees: 12,
        },
        {
            name: "Stock",
            student: 5,
            fees: 10,
        },
        {
            name: "To",
            student: 10,
            fees: 5,
        },
        {
            name: "View",
            student: 9,
            fees: 4,
        },
        {
            name: "The Graph.",
            student: 10,
            fees: 8,
        },
    ];
    const lineColor = 'rgba(0, 255, 255, 0.8)';
    const gridColor = 'rgba(255, 255, 255, 0.1)';
    const backgroundColor = 'rgba(0, 0, 0, 0.8)';
    const glowColor = 'rgba(0, 255, 255, 0.5)';
    const [chartData, setChart] = useState({
        labels: "no stock selected",
        datasets: [
            {
                label: `No Stock Price`,
                data: Object.values([]),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    })
    const [isMobile, setIsMobile] = useState(false);
    const [activeTrade, setActiveTrade] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const handleTradeClick = (tradeType) => {
      setActiveTrade(activeTrade === tradeType ? null : tradeType);
    };
    //for toast messages
    const notify = (msg,type) => {
        if (type==="success"){
        toast.success(msg, {                       
            position: "bottom-center",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        }else{
            toast.warning(msg, {                       
                position: "bottom-center",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    const fetchUser = async () =>{
        // Assume token is stored in localStorage after login
        const token = localStorage.getItem('token');
        const loggedinuser = await fetch(`${apiUrl}/api/profile`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        })
        const userdata = await loggedinuser.json();
        setUser(userdata);
        setBought(userdata.bought_stocks);
   };
    const handleSubmit = async (tradeType) => {
      if (user.demat_amnt<=0 && tradeType==='buy'){
        notify("You are out of money!\nAdd amount through your profile","warn");
      }else if(tradeType==='sell' && user && userstocks[0].quantity<quantity){
        notify("You cannot sell more than what u have!\n","warn");
      }
      else{
        const userId = user._id;
        if ((tradeType==="sell"&&(userstocks?userstocks[0].status:"Close"==="Open"))||tradeType==="buy"){
        console.log(`Submitting ${tradeType} order for ${current.symbol}, amount ${quantity}`);
        const response = await fetch(`${apiUrl}/api/bs/${tradeType}/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbol: current.symbol,
                price: current.historical_data[current.historical_data.length-1].price,
                quantity: quantity
            })
        });
        const data = await response.json();
        fetchUser();
        seeStocks(current.symbol);
        notify(data.msg,data.msg.includes("not")?"warn":"success");
        }else{
            notify("Trade was closed earlier else You  haven't bought any stocks yet!","warn");
        }
      }
      setActiveTrade(null);
    }
    const handleClose = () => {
        setActiveTrade(null);
      };
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);
    useEffect(() => {
        if (!localStorage.getItem('token')){
            notify("Login to view stock prices","warn");
            navigate("/login");
        }
        const fetchSymbols = async () => {
            // Assume token is stored in localStorage after login
            const token = localStorage.getItem('token');
            const loggedinuser = await fetch(`${apiUrl}/api/profile`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            })
            const userdata = await loggedinuser.json();
            setUser(userdata);
            setBought(userdata.bought_stocks);
            const response = await fetch(`${apiUrl}/api/orgs/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (response.ok) {
                setSymbols(data);
            } else {
                notify(data.msg,"error");
            }
        };
        fetchSymbols();
    }, []);
    const seeStocks = async(symbol) => {
        setLoading(true);
        const matchingStocks = bought.filter(stock => stock.symbol === symbol);
        //console.log("Matching stocks found:",matchingStocks);
        if (matchingStocks.length > 0 && matchingStocks[0].status==="Open") {
          //console.log("Matching stocks found:",matchingStocks);
          setuserstock(matchingStocks);
        }else{
            setuserstock(null);
        }
        const response = await fetch(`${apiUrl}/api/orgs/${symbol}`, {
        });
        const data = await response.json();
        //console.log(data);
        if (data){
            setCurrent(data);
        }
        /*setChart({
            labels: Object.keys(data.historical_data),
            datasets: [
                {
                    label: `${data.org_name} Stock Price`,
                    data: Object.values(data.historical_data),
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                },
            ],
        })*/
        //console.log("fetched!");
        setLoading(false);
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const symbol = searchParams.get('symbol');
        if (symbol) {
          seeStocks(symbol);
        }
      }, [location.search]);
    useEffect(() => {
        // Only set interval if a stock is selected
        if (current) {
            const interval = setInterval(async () => {
                //console.log("user:",userstocks);
                //console.log(`Auto-updating data for ${current.symbol}`);
                const updatedData = await seeStocks(current.symbol);
                if (updatedData) {
                    setCurrent(updatedData);
                }
            }, 5000); // 300,000 ms = 5 minutes

            // Clear interval on component unmount or when current changes
            return () => clearInterval(interval);
        }
    }, [current]);
    // Calculate the min and max for the Y-axis from the data
    const data = current ? current.historical_data : dummy;
    const minValue = Math.min(...data.map(item => item.price));
    const maxValue = Math.max(...data.map(item => item.price));
    
    // Optional padding to ensure some space above and below the data points
    const padding = (maxValue - minValue) * 0.1;
    //to convert GMT to IST
    const convertToIST = (gmtDateString) => {
    const gmtDate = new Date(gmtDateString);
    const istDate = new Date(gmtDate.getTime() - (5 * 60 + 30) * 60 * 1000);
    return istDate.toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    };

    // In your component, before rendering:
    const convertedData = data.map(item => ({
    ...item,
    datetime: convertToIST(item.datetime)
    }));
        
    //reference lines
    const boughtPrice = userstocks?userstocks[0].price:1;//change it later
    //console.log("bought at: ",boughtPrice);
    const currentPrice = current ? current.historical_data[current.historical_data.length - 1].price : dummy[dummy.length - 1].price;
    const priceColor = currentPrice > boughtPrice ? 'green' : currentPrice < boughtPrice ? 'red' : 'blue';

    return (
        <>
        <Navbar/>
        <div>
            <div className="stock-buttons">
                    {symbols.map((symbol) => (
                        <button 
                            key={symbol} 
                            onClick={() => seeStocks(symbol)}
                            className="stock-button"
                        >
                            {symbol}
                        </button>
                    ))}
                </div>
            <h3 className="text-heading">{current?current.symbol:"SELECT A SYMBOL"} 
            <span class="loader-text">{loading&&"Loading Data..."} </span><span class="neutral">{marketStatus} </span></h3>
            <div className="price-info">
                <p>Current Price: {current?current.historical_data[current.historical_data.length-1].price:"No stocks selected!"}</p>
                <p className={
                    current ?
                    (current.pl > 0 ? "profit" : current.pl < 0 ? "loss" : "neutral")
                    : "no-data"
                }>
                    || Net Profit:{current ? `${current.pl}%` : "No Data"} 
                    {userstocks&&(<span className={
                    current&&userstocks?
                    (current.historical_data[current.historical_data.length-1].price > boughtPrice ? "profit" : current.historical_data[current.historical_data.length-1].price < boughtPrice ? "loss" : "neutral")
                    : "no-data"
                    }>
                    || Your Profit:{current ? `${current.historical_data[current.historical_data.length-1].price-boughtPrice}Rs` : "No Data"}
                    </span>)}
                </p>
            </div>
            <div style={{ background: backgroundColor, padding: '20px', borderRadius: '10px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height={isMobile ? 300 : '100%'} aspect={isMobile ? undefined : 3}>
            <p>Time is in GMT</p>
                <LineChart data={data} 
                    margin={{ right: isMobile ? 70 : 50, left: 20, top: 20, bottom: 20 }}>
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#00f0ff" />
                            <stop offset="100%" stopColor="#0050ff" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke={gridColor} />
                    <XAxis 
                        dataKey={current ? "datetime" : "name"} 
                        interval={"preserveStartEnd"} 
                        tick={{ fill: 'white', fontSize: 12 }}
                        angle={-20}
                        textAnchor="end"
                        height={70}
                    />
                    <YAxis 
                        domain={['dataMin', 'dataMax']}  
                        tick={{ fill: 'white', fontSize: 12 }}
                    />
                    <Legend 
                        wrapperStyle={{ color: 'white' }} 
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#333', borderColor: '#333' }}
                        itemStyle={{ color: '#00f0ff' }}
                    />
                    <Line
                        dataKey={current ? "price" : "fees"}
                        stroke="url(#lineGradient)"
                        strokeWidth={2}
                        dot={{ stroke: glowColor, strokeWidth: 1, r: 1 }}
                        activeDot={{ r: 2, stroke: glowColor }}
                    />
                    <ReferenceLine 
                        y={boughtPrice} 
                        stroke="blue" 
                        strokeWidth={1} 
                        label={{ 
                            value: `${boughtPrice}`, 
                            position: 'right', 
                            fill: 'blue', 
                            fontSize: isMobile ? 10 : 12,
                            dy: -10  // Offset the label position
                        }} 
                    />
                    <ReferenceLine 
                        y={currentPrice} 
                        stroke={priceColor} 
                        strokeWidth={1} 
                        label={{ 
                            value: `${currentPrice}`, 
                            position: 'right', 
                            fill: priceColor, 
                            fontSize: isMobile ? 10 : 12,
                            dy: 10  // Offset the label position
                        }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
        {/*buy and sell buttons , will add stop loss and take profit soon */}
        <div className="trade-buttons">
        <div className={`trade-button-container ${activeTrade === 'buy' ? 'active' : ''}`}>
            <button 
            className="trade-button buy" 
            onClick={() => handleTradeClick('buy')}
            >
            Buy
            </button>
            {activeTrade === 'buy' && (
            <div className="trade-form">
                <p>Enter amount to buy:{current?current.historical_data[current.historical_data.length-1].price*quantity:"N/A"}</p>
                <div className="input-container">
                <input type="number" placeholder="Amount" onChange={(e)=>setQuantity(e.target.value)}/>
                <button className="submit-arrow" onClick={() => handleSubmit('buy')}>
                    ➜
                </button>
                </div>
            </div>
            )}
        </div>
      <div className={`trade-button-container ${activeTrade === 'sell' ? 'active' : ''}`}>
            <button 
            className="trade-button sell" 
            onClick={() => handleTradeClick('sell')}
            >
            Sell
            </button>
            {activeTrade === 'sell' && (
            <div className="trade-form">
                <p>Qty:{userstocks?userstocks[0].quantity:"N/A"}</p>
                <p>Enter amount to sell:{current?current.historical_data[current.historical_data.length-1].price*quantity:"N/A"}</p>
                <div className="input-container">
                <input type="number" placeholder="Amount" onChange={(e)=>setQuantity(e.target.value)}/>
                <button className="submit-arrow" onClick={() => handleSubmit('sell')}>
                    ➜
                </button>
                </div>
            </div>
            )}
        </div>
        </div>
        </>
    );
};

export default StockDisplay;
