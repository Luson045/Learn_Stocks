// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Demat from './components/Demat';
import StockDisplay from './components/StockDisplay';
import Portfolio from './components/Portfolio';
import Features from './components/Features';
import Pricing from './components/Pricing';
import TermsAndConditions from './components/TermsAndConditions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/global.css';
const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/demat" element={<Demat />} />
                    <Route path="/stock" element={<StockDisplay />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/terms" element={<TermsAndConditions/>} />
                    <Route path="/resources" element={<Features/>}/>
                    <Route path="/pricing" element={<Pricing/>}/>
                </Routes>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    className="custom-toast-container"
                />
                <Footer/>
            </div>
        </Router>
    );
};

export default App;
