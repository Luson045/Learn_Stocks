import React, { useState, useEffect } from 'react';
import '../css/HomePage.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { FaDotCircle, FaRegDotCircle } from 'react-icons/fa'; // For navigation dots
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getEnvironment from "../getenvironment";


const HomePage = () => {
    const apiUrl = getEnvironment();
    const navigate = useNavigate();  const [showPopup, setShowPopup] = useState(false);
    const [rating, setRating] = useState(0);
    const [rname, setName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [reviewstatus, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [usercount, setUserCount] =useState(0);
    useEffect(() => {
        const addVisitor = async () => {
          try {
            const response = await fetch(`${apiUrl}/api/adduser`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const userdata = await response.json();
            setUserCount(userdata); // Assuming the response contains a 'count' field
            console.log(userdata);
          } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
          }
        };
    
        addVisitor();
      }, []); // Ensure this dependency array is empty to run only once
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
    const handleRating = (rate) => {
      setRating(rate);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch(`${apiUrl}/api/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: rname,
                rating: rating,
                review: feedback,
            })
        });
        const data = await response.json();
      setReview(data);
      setSubmitted(true);
      setTimeout(() => {
        setShowPopup(false);
        setSubmitted(false);
        setRating(0);
        setFeedback('');
      }, 2000); // Close the popup after 2 seconds
    };

    // Features data
    const features = [
        {
            no: 1,
            title: 'Buy and Sell Simulation',
            desc: 'Experience simulated buying and selling of stocks with real-time data.\n[NO REAL MONEY TRADING]',
        },
        {
            no: 2,
            title: 'Free Tier',
            desc: "Learn stock trading without spending any money! Experiment with virtual money.",
        },
        {
            no: 3,
            title: 'Virtual Portfolio Management',
            desc: 'Manage and monitor your virtual portfolio with ease.',
        },
        {
            no: 4,
            title: 'Market Analysis Tools',
            desc: 'Access detailed market analysis tool to help you make informed decisions in simulations.',
        },
        {
            no: 5,
            title: 'Community Support',
            desc: 'Join our community and get support from other learners.\n[Coming Soon...]',
        },
    ];
    

    // Reviews data
    const reviews = [
        {
            id: 1,
            name: 'JNerdy User',
            review: 'Great Platform for beginners to learn stock trading. And the best part is it is free',
            rating: 5,
            avatar: 'https://via.placeholder.com/50', // Placeholder for user avatar
        },
        {
            id: 2,
            name: 'Another user',
            review: 'Great Platform to begin from.',
            rating: 4,
            avatar: 'https://via.placeholder.com/50', // Placeholder for user avatar
        },
        {
            id: 3,
            name: 'Ranju Boro',
            review: 'Very helpful for beginner.',
            rating: 5,
            avatar: 'https://via.placeholder.com/50', // Placeholder for user avatar
        },
    ];

    // State to track the active feature
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
    const [fade, setFade] = useState(true);

    // Automatically change the active feature every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setActiveFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
                setFade(true);
            }, 500); // Match this to the fade-out duration
        }, 5000); // Change feature every 5 seconds

        return () => clearInterval(interval);
    }, [features.length]);

    // Function to manually set the active feature
    const handleDotClick = (index) => {
        setFade(false);
        setTimeout(() => {
            setActiveFeatureIndex(index);
            setFade(true);
        }, 500); // Match this to the fade-out duration
    };

    return (
        <>
            <Navbar />
            {usercount === 0 && (
                <div className="video-overlay">
                      <video autoplay muted loop id="bgVideo">
                        <source src="cover_back.mp4" type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                    <video autoPlay loop muted className="background-video">
                        <source src="cover.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
            <div className="homepage">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1>Welcome to LearnStocks</h1>
                        <p>Your go to platform for learning stock trading without spending a penny.</p>
                        <button className="cta-button" onClick={() => {
                            if (localStorage.getItem('token')) {
                                navigate("/profile");
                            } else {
                                navigate("/login");
                            }
                        }}>Get Started</button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-carousel">
                    <div className={`carousel-container ${fade ? 'fade-in' : 'fade-out'}`}>
                        {features.map((feature, index) => (
                            <div
                                key={feature.no}
                                className={`carousel-slide ${index === activeFeatureIndex ? 'active' : ''}`}
                            >
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="carousel-dots">
                        {features.map((_, index) => (
                            <div
                                key={index}
                                className="dot"
                                onClick={() => handleDotClick(index)}
                            >
                                {index === activeFeatureIndex ? <FaDotCircle /> : <FaRegDotCircle />}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="reviews">
                    <h2>What Our Users Say</h2>
                    <div className="reviews-container">
                        {reviews.map(review => (
                            <div key={review.id} className="review-card">
                                <img src={review.avatar} alt={`${review.name} avatar`} className="review-avatar" />
                                <div className="review-content">
                                    <h3>{review.name}</h3>
                                    <p>{review.review}</p>
                                    <p className="rating">Rating: {review.rating} / 5</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <button onClick={() => setShowPopup(true)} className="rate-us-button">
                    Rate Us
                </button>
                
                {showPopup && (
                    <div className="popup-overlay">
                    <div className="popup">
                        <h2>Rate Us</h2>
                        {!submitted ? (
                        <form onSubmit={handleSubmit}>
                            <div className="rating">
                            {[...Array(5)].map((star, index) => (
                                <span
                                key={index}
                                className={`star ${index < rating ? 'selected' : ''}`}
                                onClick={() => handleRating(index + 1)}
                                >
                                &#9733;
                                </span>
                            ))}
                            </div>
                            <input
                            placeholder="Your Name..."
                            value={rname}
                            required="true"
                            onChange={(e) => setName(e.target.value)}
                            />
                            <textarea
                            placeholder="Leave your feedback here..."
                            value={feedback}
                            required="true"
                            onChange={(e) => setFeedback(e.target.value)}
                            />
                            <button type="submit">Submit</button>
                        </form>
                        ) : (
                        <div className="thank-you">
                            <h3>{reviewstatus}</h3>
                        </div>
                        )}
                        <button className="close-popup" onClick={() => setShowPopup(false)}>X</button>
                    </div>
                    </div>
                )}
            </div>
                <div className="visitor-count">
            <h2>No. of Visitors: <span>{usercount}</span></h2>
        </div>
        </>
    );
};

export default HomePage;
