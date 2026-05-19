# 🏷 RESTful Blog API with Commenting System

> A backend API for a blogging platform that allows users to manage blog posts and comments.

---

## 📌 Problem Statement

Managing blog content and user interactions (like comments) efficiently requires a robust backend API. This project provides a RESTful API to handle blog posts, comments, and user authentication.

---

## 🎯 Project Goals

- Allow user registration and authentication
- Enable CRUD operations for blog posts
- Enable CRUD operations for comments (with relationship to posts)
- Provide secure and validated endpoints
- Ensure data integrity with proper database relationships

---

## 🛠 Tech Stack

**Backend:**  
- Node.js  
- Express  
- PostgreSQL  

**Other Tools:**  
- GitHub  
- Postman (for testing)  
- dotenv (for environment variables)  
- Jest (for testing)  

---

## 🖥 Features

- User authentication (JWT)
- Input validation
- CRUD operations for posts and comments
- Pagination for posts
- Error handling
- Modular routing
- Connection pooling
- SQL injection prevention

---

## 🔗 Live Demo

Backend API: http://localhost:5000 (when running locally)

---

## ⚙ Installation & Setup

Clone the repository:

```bash
git clone git@github.com:ndang11/restful-blog-api-1.git
cd resful-blog-api-1
```

Create a `.env` file based on `.env.example`:

Edit `.env` with your PostgreSQL credentials:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASS=your_password
DB_NAME=blog_db
JWT_SECRET=your_jwt_secret
```

Install dependencies:

```bash
npm install
```

Run database setup scripts (create tables, insert sample data):

```bash
npm run setup
```

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:5000`.

---

## 🧠 Challenges Faced

- Designing the database schema with proper relationships and cascading deletes
- Implementing JWT authentication securely with token verification
- Handling asynchronous database operations with async/await and error handling
- Ensuring data integrity with foreign key constraints
- Implementing efficient pagination and search with SQL LIMIT/OFFSET and LIKE queries
- Preventing SQL injection through parameterized queries

---

## Future Improvements

- Add role-based access control (admin, moderator, user)
- Implement image upload for posts and profile pictures (using Multer/cloud storage)
- Add email verification for user registration
- Improve test coverage to 90%+
- Deploy to a cloud service (Render, AWS, or Heroku)
- Add API documentation with Swagger/OpenAPI
- Implement caching for frequently accessed posts
- Add real-time comments with WebSockets

---

## 👨🏽‍💻 Author

NDANG-KAH A

Fullstack Developer

📩 Email: ndangkahambei@email.com
🌍 Based in Cameroon | Open to remote opportunities