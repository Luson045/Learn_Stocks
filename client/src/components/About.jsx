import React, { useState } from 'react';
import Navbar from './Navbar';
import '../css/About.css'; // Import the CSS file for styling

const About = () => {
    // Define features for the tabs
    const features = [
        { title: "Who are we?", content: "Learn Stocks is a purely learning based platform for our users to get hands on experience with our simulated real time environment and get the required knowledge to get started in stock market trading! Use of real money is prohibited for trading purpose!" },
        { title: "What we offer?", content: "At Learn Stocks we provide you real time data of 30+ Indian companies listed under NSE, These data are shown in a graph for the users to learn better, we also provide the technical indicators! Buy and sell these virtual stocks and see how you perform. There's more to come soon..." },
        { title: "What is our aim", content: "Stock market investment has taken over the world by storm, where many people have gatherd riches, many have failed. We aim to provide our users with the basic stepping stone into the world of stock market, we aim to provide users with right knowledge to understand the risks and benefits of investing." },
        { title: "How you can help us?", content: "Dont engage in any mispractice, our platform doesn't promote unauthorized buying and selling of stocks, which is illegal, No real money would be taken for the purpose of buying and selling these virtual stocks, and any claims for real money won't be entertained! In future updates some new features like stop loss and get profits will come, so stay tuned, and maintain a healthy environment! Remember, no rich man becomes rich overnight, patience is the key!" },
        { title: "Do's", content: "1. Use the platform to learn and practice stock trading.\n2. Keep your account information secure.\n3. Report any issues or bugs to 'yuria4489@gmail.com'." },
        { title: "Don'ts", content: "1. Attempt to convert virtual money to real money.\n2. Engage in unauthorized buying and selling of stocks.\n3. Tamper with or manipulate data on the platform.\n4. Use the platform for real-world trading decisions.\n5. Share your account credentials with others." }
    ];

    // State to manage the active tab
    const [activeTab, setActiveTab] = useState(null); // Changed from number to allow no active tab initially

    const handleTabClick = (index) => {
        setActiveTab(activeTab === index ? null : index); // Toggle the clicked tab
    };

    return (
        <>
            <Navbar />
            <div className="about-container">
                {/* Hero Section */}
                <div className="about-hero">
                    <h1>About Us</h1>
                    <p>Welcome to Learn Stocks, your go-to platform for learning and trading stocks with virtual money. Our goal is to provide a comprehensive learning experience for everyone interested in the stock market, from beginners to experienced traders.</p>
                </div>
                {/* Features Accordion Section */}
                <div className="features-accordion">
                    {features.map((feature, index) => (
                        <div key={index} className="accordion-item">
                            <button
                                className={`accordion-title ${activeTab === index ? 'active' : ''}`}
                                onClick={() => handleTabClick(index)}
                            >
                                {feature.title}
                            </button>
                            <div className={`accordion-content ${activeTab === index ? 'open' : ''}`}>
                                <p>{feature.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Developer Section */}
                <div className="developer-section">
                    <img
                        src="placeholder.png" // Replace with actual developer image URL
                        alt="Developer"
                        className="developer-image"
                    />
                    <div className="developer-info">
                        <h2>Developer Name</h2>
                        <p>Hi, I'm Luson, the developer behind Learn Stocks. With a passion for technology and finance, I created this platform to help others understand and navigate the stock market. Enjoy your learning journey!</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;