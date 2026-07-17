# 🚀 InterviewAI

An AI-powered Full Stack Interview Management Platform built with **React, Spring Boot, MySQL, JWT Authentication, and Google Gemini AI**. The application helps users create, manage, analyze, and improve interview performance through interactive dashboards and AI-generated feedback.

---

## 🌐 Live Demo

**Frontend:**  
https://interviewai-frontend-jokl.onrender.com

**Backend API:**  
https://interviewai-backend-bof4.onrender.com

---

# ✨ Features

### 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Logout

### 🎯 Interview Management
- Create Interview
- Update Interview
- Delete Interview
- Mark as Favorite
- View Interview Details

### 📊 Dashboard Analytics
- Total Interviews
- Average Score
- Completed Interviews
- Performance Trends
- Weekly Activity
- Monthly Statistics
- Role-wise Performance

### 🤖 AI Features
- AI-generated Interview Feedback
- Performance Analysis
- Personalized Suggestions
- Google Gemini API Integration

### 📄 Reports
- Detailed Interview Reports
- Performance Summary
- PDF Export

---

# 🛠 Tech Stack

## Frontend
- React.js
- Vite
- Bootstrap 5
- Axios
- React Router
- Chart.js

## Backend
- Java 24
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate

## Database
- MySQL

## AI
- Google Gemini API

## Deployment
- Render (Frontend)
- Render (Backend)

---

# 📂 Project Structure

```
InterviewAI
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── application.properties
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/sheikhhamza1501-dot/InterviewAI.git

cd InterviewAI
```

---

## Backend Setup

```bash
cd backend
```

Configure:

```
application.properties
```

Run

```bash
./mvnw spring-boot:run
```

or

```bash
mvn spring-boot:run
```

Backend runs on

```
http://localhost:8080
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Runs on

```
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend

```
DB_URL=${DB_URL}

DB_USERNAME=${DB_USERNAME}

DB_PASSWORD=${DB_PASSWORD}

JWT_SECRET=${SECRET_KEY}

JWT_EXPIRATION=

GEMINI_API_KEY=${GEMINI_API_KEY}
```

## Frontend

```
VITE_API_URL=http://localhost:8080
```

For deployment:

```
VITE_API_URL=https://https://interviewai-backend-bof4.onrender.com
```

---

# 📡 REST APIs

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Interviews

| Method | Endpoint |
|---------|----------|
| POST | /api/interviews |
| GET | /api/interviews |
| GET | /api/interviews/{id} |
| PUT | /api/interviews/{id} |
| DELETE | /api/interviews/{id} |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | /api/interviews/dashboard/stats |
| GET | /api/interviews/dashboard/score-trend |
| GET | /api/interviews/dashboard/weekly-activity |
| GET | /api/interviews/monthly-stats |
| GET | /api/interviews/role-performance |

---

# 🔒 Security

- JWT Authentication
- Password Encryption (BCrypt)
- Protected REST APIs
- Spring Security
- CORS Configuration

---

# 🚀 Deployment

The project is deployed using Render.

Frontend:
```
https://interviewai-frontend-jokl.onrender.com
```

Backend:
```
https://interviewai-backend-bof4.onrender.com
```

---

# 💡 Future Enhancements

- Email Verification
- Password Reset
- AI Mock Interviews
- Resume Analyzer
- Interview Scheduling
- Notification System
- Admin Dashboard
- Docker Support
- CI/CD Pipeline
- Multi-language Support

---

# 👨‍💻 Author

**Sheikh Hamza Sheikh Nazir**

- GitHub: https://github.com/sheikhhamza1501-dot
- LinkedIn: https://linkedin.com/in/sheikh-hamza-sheikh-nazir-b5046b3b6

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

---

## 📜 License

This project is licensed under the MIT License.
