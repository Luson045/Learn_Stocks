import React, { useEffect, useState } from 'react';
import '../css/Profile.css';
import Navbar from './Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getEnvironment from "../getenvironment";

const Profile = () => {
    const apiUrl = getEnvironment();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const location = useLocation();
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
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            notify("Verification Successful","success");
        }
    }, [location]);
    useEffect(() => {
        if (!localStorage.getItem('token')){
            navigate("/login");
        }
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

        fetchProfile();
    }, []);

    const demat = () => {
        navigate("/demat");
    }

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-content">
                <div className="profile-container">
                    <h2>User Profile</h2>
                    {user ? (
                        <div className="profile-info">
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                    ) : (
                        <p className="loading">Loading...</p>
                    )}
                </div>
                <div className="demat-details">
                    <h2>Virtual Demat Account</h2>
                    {user ? (
                        <>
                            <p><strong>Amount:</strong> {user.demat_amnt}</p>
                            <button className="demat-button" onClick={demat}>Account</button>
                        </>
                    ) : (
                        <p className="loading">Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;