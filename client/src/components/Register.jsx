import React, { useState } from 'react';
import '../css/Auth.css';
import '../css/Register.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import getEnvironment from "../getenvironment";

const Register = () => {
    const apiUrl = getEnvironment();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [terms, setTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const notify = (msg, type) => {
        if (type === "success") {
            toast.success(msg, {
                position: "bottom-center",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error(msg, {
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
        if (!terms) {
            notify("You must accept the terms and conditions", "warning");
            return;
        }
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, terms }),
        });
        const data = await response.json();
        if (response.ok) {
            notify("verification email sent to your email! Please check your email to continue.","success");
        } else {
            notify(data.msg, "warning");
        }
    };

    return (
        <>
            <Navbar />
            <div className='Contain'>
                <div className="auth-container">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
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
                        <button type="button" onClick={() => setShowTerms(true)} className="terms-button">
                            Read Terms and Conditions
                        </button>
                        <div className={`terms-popup ${showTerms ? 'show' : ''}`}>
                            <div className="terms-content">
                                <button onClick={() => setShowTerms(false)} className="close-popup">&times;</button>
                                <h3>Terms and Conditions</h3>
                                <div className="terms-scroll">
                                    <p>
                                        Please read these terms and conditions carefully before using our platform. By registering and using this platform, you agree to comply with and be bound by the following terms and conditions.

                                        1. No real money is involved in any transactions on this platform.
                                        2. Unauthorized buying and selling are prohibited.
                                        3. Tampering with data is strictly prohibited.
                                        4. The platform is for educational purposes only and does not provide financial advice.
                                        5. The company is not liable for any virtual losses or gains.
                                        6. Users must comply with all applicable laws and regulations.

                                        No Real Money Claims:
                                        All trading activities on this platform are conducted using virtual money. Under no circumstances can virtual money be claimed or converted to real money. The company does not entertain any claims for real money based on the use of this platform.

                                        Unauthorized Buying and Selling:
                                        Users are prohibited from engaging in unauthorized buying and selling of stocks. All trading activities must be conducted through the provided interfaces and in compliance with applicable laws and regulations.

                                        Prohibition of Data Tampering:
                                        Any attempt to tamper with, manipulate, or alter data on this platform is strictly prohibited. This includes, but is not limited to, attempts to hack, disrupt, or interfere with the normal operation of the platform.

                                        User Responsibilities:
                                        Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Users agree to notify the company immediately of any unauthorized use of their account.

                                        Limitation of Liability:
                                        The company is not liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of this platform. This includes, without limitation, any loss of data, loss of profits, or other economic advantage.

                                        Amendments:
                                        The company reserves the right to amend these terms and conditions at any time. Users will be notified of any significant changes, and continued use of the platform constitutes acceptance of the updated terms and conditions.

                                        Governing Law:
                                        These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the company is headquartered, without regard to its conflict of law principles.

                                        Contact Information:
                                        If you have any questions about these terms and conditions, please contact us at [yuria4489@gmail.com].

                                        By using this platform, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
                                    </p>
                                </div>
                                <div className="terms-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={terms} 
                                        onChange={(e) => {
                                            setTerms(e.target.checked);
                                            setShowTerms(false);
                                        }}
                                    />
                                    <label>I accept the terms and conditions</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit">{isLoading?"Processing":"Register"}</button>
                    </form>
                    <p className="redirect">A verfication link will be sent on regstering, please verify your email to continue</p>
                    <p className="redirect">Already have an account? <a href="/login">Sign in</a></p>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Register;
