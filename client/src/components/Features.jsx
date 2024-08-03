import React, { useEffect, useState, useRef } from 'react';
import '../css/Feature.css';
import Navbar from './Navbar';
import getEnvironment from "../getenvironment";

const Features = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const apiUrl = getEnvironment();
    const contentRef = useRef(null);

    useEffect(() => {
        fetch(`${apiUrl}/api/fetchCourses`)
            .then(response => response.json())
            .then(data => {
                const sortedCourses = data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                setCourses(sortedCourses);
            })
            .catch(error => console.error('Error fetching courses:', error));
    }, [apiUrl]);
    return (
        <>
            <Navbar />
            <h2>All Courses</h2>
            <div className="centered">
                <ul>
                    {courses.map(course => (
                        <li key={course._id}>
                            <h3 className="course-title">{course.title}</h3>
                            <p>Uploaded on: {new Date(course.uploadDate).toLocaleDateString()}</p>
                            <button className="butt" onClick={() => setSelectedCourse(course)}>View Course</button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedCourse && (
                <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="content-wrapper" ref={contentRef}>
                            <h2>{selectedCourse.title}</h2>
                            <div dangerouslySetInnerHTML={{ __html: selectedCourse.content }} />
                        </div>
                        <button className="close-button" onClick={() => setSelectedCourse(null)}>x</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Features;