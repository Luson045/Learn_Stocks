// Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import getEnvironment from "../getenvironment";

const Navbar = () => {
    const apiUrl = getEnvironment();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setAuth] = useState(false);
    const [mobileView, setMobileView] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isHidden, setIsHidden] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to logout');
            }

            // Clear the token and update the state
            localStorage.removeItem('token');
            setUser(null);
            setAuth(false);
            setMobileView(false);

            // Redirect to the login page or home page
            navigate('/login');

        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/api/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setAuth(true);
                } else {
                    // Handle unauthorized or other errors
                    const data = await response.json();
                    console.error(data.msg);
                    setAuth(false);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, []);
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

            if (currentScrollTop > lastScrollTop) {
                // Scroll down
                setIsHidden(true);
            } else {
                // Scroll up
                setIsHidden(false);
            }

            setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    const handleToggle = () => {
        setMobileView(!mobileView);
    };

    return (
        <nav className={`navbar ${isHidden ? 'hidden' : ''}`}>
            <div className="navbar-logo">
                <Link to="/"><img src="logo-transparent-png.png" className='logo-img'></img></Link>
            </div>
            <div className="navbar-links">
                <ul className={mobileView ? 'navbar-links-mobile' : 'navbar-links-desktop'}>
                    <li>
                        <Link to="/" onClick={() => setMobileView(false)}>Home</Link>
                    </li>
                    <li>
                        <Link to="/about" onClick={() => setMobileView(false)}>About</Link>
                    </li>
                    <li>
                        <Link to="/resources" onClick={() => setMobileView(false)}>Resources</Link>
                    </li>
                    <li>
                        <Link to="/stock" onClick={() => setMobileView(false)}>Stocks</Link>
                    </li>
                    <li>
                        <Link to="/portfolio" onClick={() => setMobileView(false)}>Portfolio</Link>
                    </li>
                    {!isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/login" onClick={() => setMobileView(false)}>Login</Link>
                            </li>
                            <li>
                                <Link to="/register" onClick={() => setMobileView(false)}>Register</Link>
                            </li>
                        </>
                    ):(
                        <>
                            <li>
                                <Link to="/" onClick={handleLogout}>Logout</Link>
                            </li>
                            <li>
                                <Link to="/profile" onClick={() => setMobileView(false)}>
                                    <span>{user.name} <FaUserCircle /></span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            <div className="navbar-toggle" onClick={handleToggle}>
                {mobileView ? <FaTimes /> : <FaBars />}
            </div>
        </nav>
    );
};

export default Navbar;
