import React, { useEffect, useState, useCallback } from 'react';
import '../css/Portfolio.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getEnvironment from "../getenvironment";

const Portfolio = () => {
  const apiUrl = getEnvironment();
  const [bought, setBought] = useState([]);
  const [user, setUser] = useState(null);
  const [topPerformer, setTopPerformer] = useState('N/A');
  const navigate = useNavigate();
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
  const findTopPerformer = (stocks) => {
    if (stocks.length === 0) return 'N/A';
    
    return stocks.reduce((topStock, currentStock) => {
      return currentStock.pl > topStock.pl ? currentStock : topStock;
    }, stocks[0]);
  };
  useEffect(() => {
    if (!localStorage.getItem('token')){
        navigate("/login");
    }
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });
      const userdata = await response.json();
      setUser(userdata);
    };

    fetchUser();
  }, []);

  const fetchUpdates = useCallback(async () => {
    if (user) {
      const response = await fetch(`${apiUrl}/api/bs/new/${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const boughtData = await response.json();
      setBought(boughtData || []);
      const topStock = findTopPerformer(boughtData);
      setTopPerformer(topStock.symbol);
    }
  }, [user]);

  useEffect(() => {
    fetchUpdates(); // Initial fetch
    const interval = setInterval(() => {
      console.log('Auto-updating data');
      fetchUpdates();
    }, 60000); // 300,000 ms = 5 minutes

    return () => clearInterval(interval);
  }, [user, fetchUpdates]);
  const handleStockClick = (symbol) => {
    navigate(`/stock?symbol=${symbol}`);
    notify("Please wait, we're searching your data","success");
  };

  return (
    <>
      <Navbar />
      <div className="stock-section">
        <h2>Portfolio</h2>
          <div className="additional-cards">
            <div className="info-card">
              <p><strong>Total Amount:</strong> {user?user.demat_amnt:'0'} Rs</p>
            </div>
            <div className="info-card">
              <p><strong>Total Investment:</strong> {user?user.investment_amnt?user.investment_amnt:"0":'0'} Rs</p>
            </div>
            <div className="info-card">
              <p><strong>Total Returns:</strong> {user?user.net_pl:'0'} Rs</p>
            </div>
            <div className="info-card">
              <p><strong>Top Performer:</strong> {topPerformer}</p>
            </div>
          </div>
        <div className="stock-list">
          {bought.map((stock, index) => (
            <div key={index} className="stock-item"
              onClick={() => handleStockClick(stock.symbol)}>
              <p><strong>Symbol:</strong> {stock.symbol}</p>
              <p><strong>Price:</strong> {stock.price.toFixed(2)} Rs</p>
              <p><strong>Qty:</strong> {stock.quantity}</p>
              <p><strong>Status:</strong> {stock.status}</p>
              <p className={`pl ${stock.pl > 0 ? 'positive' : stock.pl < 0 ? 'negative' : 'neutral'}`}>
                <strong>P/L:</strong> {stock.pl.toFixed(2)} Rs
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Portfolio;
