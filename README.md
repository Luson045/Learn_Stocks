# 📊 **Learn Stocks**

[![Node.js](https://img.shields.io/badge/Node.js-16.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/) 
[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/) 
[![Netlify](https://img.shields.io/badge/Frontend-Hosted_on_Netlify-success?style=for-the-badge&logo=netlify)](https://www.netlify.com/)
[![Render](https://img.shields.io/badge/Backend-Hosted_on_Render-blue?style=for-the-badge&logo=render)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Learn Stocks is a simulated stock trading platform built to educate users about stock trading, portfolio management, and market strategies. This platform combines real-time stock data with virtual trading and educational content to provide an engaging, risk-free learning experience.

## 🎯 **Purpose**

Learn Stocks aims to:
- **Educate** users on stock trading concepts and strategies.
- **Simulate** a real-world stock market environment with real-time data.
- **Engage** users in building and managing virtual portfolios.
- **Empower** users with financial literacy and market skills through interactive learning and expert content.

This platform is ideal for beginners and aspiring investors who want to learn how to trade in the stock market without risking real money.

---

## ⚙️ **Setup**

To get the Learn Stocks platform up and running locally, follow these steps:

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v16.x or later) [Download](https://nodejs.org/en/download/)
- **MongoDB** [Download](https://www.mongodb.com/try/download/community)
- **Git** [Download](https://git-scm.com/downloads)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/learnstocks.git
   cd learnstocks
   ```

2. **Install dependencies for both frontend and backend:**
   ```bash
   # Backend setup
   cd backend
   npm install

   # Frontend setup
   cd ../frontend
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the backend folder and add the following:
     ```bash
     MONGO_URI=your_mongodb_connection_string
     PORT=5000
     API_KEY=your_api_key_for_stock_data
     ```
   - In the frontend, if you have any environment variables, add them to a `.env` file.

4. **Run the application locally:**
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend (in a new terminal tab)
   cd frontend
   npm start
   ```

5. **Access the application:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

---

## 🛠 **Tech Stack**

Learn Stocks is powered by modern technologies:

### **Frontend**
- [React](https://reactjs.org/) - A popular library for building user interfaces.
- **CSS/Styled Components** - For a clean and responsive UI.
- [Netlify](https://www.netlify.com/) - Hosting platform for the frontend.

### **Backend**
- [Node.js](https://nodejs.org/) - JavaScript runtime environment.
- [Express](https://expressjs.com/) - A minimal and flexible Node.js web application framework.
- [MongoDB](https://www.mongodb.com/) - NoSQL database for storing user data, stock info, and virtual portfolios.
- **APIs** - Real-time stock data is fetched from external APIs.

### **Hosting**
- **Frontend:** Hosted on [Netlify](https://netlify.com) for fast, reliable, and secure delivery.
- **Backend:** Hosted on [Render](https://render.com) for scalable and hassle-free server deployment.

---

## 🌐 **Hosting on Render and Netlify**

### **Frontend Hosting (Netlify)**
1. **Create a Netlify account** if you don’t already have one at [Netlify.com](https://www.netlify.com/).
2. **Connect your GitHub repo** to Netlify, and select the frontend folder as the root.
3. **Build Command:** 
   ```bash
   npm run build
   ```
4. **Publish Directory:** 
   ```bash
   frontend/build
   ```
5. **Deploy:** Once connected, every push to the `main` branch will automatically trigger a redeployment.

### **Backend Hosting (Render)**
1. **Create a Render account** at [Render.com](https://render.com/).
2. **Connect your GitHub repo** and select the backend folder for deployment.
3. **Build and Start Command:**
   ```bash
   npm install
   npm start
   ```
4. **Environment Variables:** Add your MongoDB URI, API keys, and any other necessary environment variables under the "Environment" section.
5. **Deploy:** Render will handle automatic deployments on pushes to the connected branch.

---

## 💡 **Contributing**

We welcome contributions! Please submit a pull request or open an issue if you'd like to contribute to the project.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Open a pull request.

---

## 📄 **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### 🚀 **Follow Us**
- [Website](https://learnstocks.com)
- [LinkedIn](https://www.linkedin.com/company/learnstocks)
- [Twitter](https://twitter.com/learnstocks)

---

Feel free to customize and tweak this according to your needs!
