

# FeedIn – Personalized Article Feed Application

**FeedIn** is a full-stack article feed web application built using the **MERN stack (MongoDB, Express.js, React, Node.js)**. It provides a personalized content experience where users can view articles posted by others, create and manage their own content, and interact with the platform based on their preferences.

##  Live Demo

[https://feedin.zapto.org](https://feedin.zapto.org) 

##  Developed by

**Mufeed**

---

##  Features

###  User-Side Functionality

* **Authentication**: Sign up and log in with secure JWT-based authentication.
* **Feed View**: See articles posted by others, filtered based on user preferences.
* **Article Management**:

  * Create articles with image upload via **Cloudinary**
  * Edit or delete your articles
* **Interactions**:

  * Like and dislike articles
  * Hide specific articles from your feed (content-based blocking only)
* **Profile Management**:

  * Update profile information 
  * View your posted articles and activity

###  Admin Features

* **User Management**:

  * View and manage all registered users
  * Block  inappropriate users
* **Preference Management**:

  * Create and manage system-wide categories/preferences
  * Tailor content suggestions across the platform

---

##  Project Structure

```
feedin/
├── client/           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   ├── public/
│   └── vite.config.ts
│
├── server/           # Express.js + Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── config/
│   └── .env

```

---

##  Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mohamedmufeed/feedin..git
cd feedin
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Create a `.env` file in the `backend/` directory with:

```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```


Start the frontend:

```bash
npm run dev
```

* Frontend runs at `http://localhost:5173`

---

##  Prerequisites

* Node.js v18+ recommended
* MongoDB (Atlas)
* Cloudinary account for image upload

---

##  License

This project is open-source under the [MIT License](LICENSE).

---

