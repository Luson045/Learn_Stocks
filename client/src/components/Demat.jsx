import React, { useState, useEffect } from 'react';
import '../css/Demat.css'; // You'll need to create this CSS file
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import getEnvironment from "../getenvironment";
const Demat = () => {
    const apiUrl = getEnvironment();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });
        const data = await response.json();
        if (response.ok) {
            setUser(data);
        } else {
            console.error(data.msg);
        }
    };
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
    const handleAddFunds = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/demat/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify({ amount: parseFloat(amount) }),
        });
        const data = await response.json();
        if (response.ok) {
            notify('Funds added successfully!','success');
            fetchProfile(); // Refresh user data
            setAmount(''); // Clear input field
        } else {
            notify(data.msg || 'Failed to add funds.',"err");
        }
    };

    return (
        <>
        <Navbar />
        <div className="demat-page">
            <div className="demat-content">
                <h2>Virtual Demat Account</h2>
                {user ? (
                    <div className="demat-info">
                        <p><strong>Current Balance:</strong> ${user.demat_amnt}</p>
                        <form onSubmit={handleAddFunds}>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount to add"
                                required
                            />
                            <button type="submit">Add Funds</button>
                        </form>
                        {message && <p className="message">{message}</p>}
                    </div>
                ) : (
                    <p className="loading">Loading...</p>
                )}
                <button className="back-button" onClick={() => navigate('/profile')}>Back to Profile</button>
                <p><strong>Note:</strong> The amount in your demat account, is not real money! Any claim for money from the company would not be entertained!</p>
            </div>
        </div>
        </>
    );
};

export default Demat;