import React, { useState } from 'react';
import '../css/Auth.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import getEnvironment from "../getenvironment";

const Login = () => {
    const apiUrl = getEnvironment();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isloading, setLoading] = useState(false);
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            notify("Login Successful","success")
            localStorage.setItem('token', data.token);
            setLoading(false); // Store the token in localStorage
            navigate('/profile');
        } else {
            notify(data.msg,"error");
        }
    };

    return (
        <>
        <Navbar/>
        <div className="auth-container">
            <h2>STOCKX</h2>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isloading?"Loading":"Login"}</button>
            </form>
            <p className="redirect">Dont have an account?<a href="/register">Sign up</a></p>
        </div>
        </>
    );
};

export default Login;
