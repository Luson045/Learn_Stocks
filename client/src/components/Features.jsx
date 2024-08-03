import React, { useEffect, useState } from 'react';
import '../css/Feature.css';
import Navbar from './Navbar';
import getEnvironment from "../getenvironment";
import html2pdf from 'html2pdf.js';

const Features = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const apiUrl = getEnvironment();

    useEffect(() => {
        // Fetch the list of courses
        fetch(`${apiUrl}/api/fetchCourses`)
            .then(response => response.json())
            .then(data => {
                const sortedCourses = data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                setCourses(sortedCourses);
            })
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    const handleDownload = (course) => {
        const element = document.createElement('div');
        element.innerHTML = course.content;

        const opt = {
            margin:       10,
            filename:     `${course.title}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };

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
                            <button className="butt" onClick={() => handleDownload(course)}>Download PDF</button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedCourse && (
                <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="content-wrapper">
                            <div dangerouslySetInnerHTML={{ __html: selectedCourse.content }} />
                        </div>
                        <button className="close-button" onClick={() => setSelectedCourse(null)}>x</button>
                        <button  className="butt" onClick={() => handleDownload(selectedCourse)}>Download PDF</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Features;