# 📊 Full Stack Product Analytics Dashboard

An interactive analytics dashboard that tracks and visualizes its **own user interactions** in real-time-like aggregated charts.

Built as part of the **Vigility Technologies Full Stack Challenge**.

# Live Demo
Frontend:
https://fsd-product-analytics-dashboard.vercel.app

Backend:
https://fsd-product-analytics-dashboard.onrender.com

GitHub Repository:
https://github.com/UtsavInTech/FSD-Product_Analytics_Dashboard

#  Project Overview

This dashboard allows product managers to analyze feature usage through:

- Interactive bar charts
- Timeline trend visualization
- Demography-based filtering
- Date range filtering
- JWT authentication system
- Event tracking system

 Special Feature:

The dashboard **tracks its own usage**.

Every interaction like:

- filter change
- chart click
- feature selection

is stored in the database and visualized again.

#  Tech Stack

## Frontend

- React (Vite)
- Recharts
- Axios
- TailwindCSS
- js-cookie

## Backend

- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- JWT Authentication
- Passlib (bcrypt)

## Deployment

- Backend → Render
- Database → Render PostgreSQL
- Frontend → Vercel

##  Project Structure

-  FSD-Product_Analytics_Dashboard
-  │
-  ├── backend
-  │   ├── app
-  │   │   ├── routes
-  │   │   ├── models.py
-  │   │   ├── schemas.py
-  │   │   ├── database.py
-  │   │   ├── auth.py
-  │   │   └── main.py
-  │   │
-  │   ├── scripts
-  │   │   └── seeds.py
-  │   │
-  │   └── requirements.txt
-  │
-  ├── frontend
-  │   ├── src
-  │   │   ├── pages
-  │   │   ├── components
-  │   │   ├── services
-  │   │   └── App.jsx
-  │   │
-  │   └── package.json
-  │
-  └── README.md

#  Authentication Flow

Implemented using JWT tokens.

### Endpoints
POST /register
POST /login
Token stored in:

localStorage
Automatically attached to:

Authorization: Bearer 
for protected API requests.


# 📊 Dashboard Features

## Filters

- Date Range Picker
- Age Filter (<18, 18–40, >40)
- Gender Filter (Male, Female, Other)

Filters persist after refresh using:
cookies
--

## Feature Usage Chart (Bar Chart)

Displays:

#  Event Tracking System

Every interaction triggers:

POST /track
Tracked actions include:

- date_picker
- filter_age
- filter_gender
- chart_bar
- export_csv
- search

Stored inside:
feature_clicks table
---

# 🗄️ Database Schema

## User Table

| Field | Type |
|------|------|
id | Integer
username | String
password | Hashed String
age | Integer
gender | String

---

## Feature Click Table

| Field | Type |
|------|------|
id | Integer
user_id | Foreign Key
feature_name | String
timestamp | Datetime

---

# 📈 Analytics Endpoint
GET /analytics
Supports filters:

- start_date
- end_date
- age
- gender
- feature_name
- scope (user/global)

Returns:

feature_usage
timeline_usage
total_clicks
---

# Data Seeding

To populate dummy analytics data:

Run:
python backend/scripts/seeds.py
Generates:
50–100 feature interaction records
across users and dates.

Ensures dashboard is not empty initially.


# ⚙️ Run Locally

## Clone repository
git clone https://github.com/UtsavInTech/FSD-Product_Analytics_Dashboard.git

---

## Backend Setup
cd backend
pip install -r requirements.txt

Create `.env`
SECRET_KEY=your_secret_key
ALGORITHM=HS256
DATABASE_URL=postgresql://username:password@localhost/dbname
Run server
uvicorn app.main:app –reload
Server runs at:
http://127.0.0.1:8000
---

## Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173
---

# Architectural Decisions

This project follows a modular full-stack architecture.

Backend structured into:
- routes
- schemas
- models
- authentication
- database layer

Benefits:

- separation of concerns
- scalable API design
- reusable business logic
- easy debugging

Frontend structured using:

- reusable components
- service layer (API handler)
- page-level architecture

Charts dynamically update based on backend aggregation queries.

# 📊 Scaling Strategy (Handling 1 Million Events / Minute)

To support high-volume analytics traffic:
I would redesign the backend using:

### Event Streaming Pipeline
Replace direct DB writes with:
Kafka / RabbitMQ
to queue click events asynchronously.

### Batch Processing
Use:
to queue click events asynchronously.
Apache Spark / Flink
for aggregation instead of real-time SQL queries.

### Caching Layer
Introduce:
Redis
for frequently requested analytics data.

### Database Optimization
Switch to:
TimescaleDB / ClickHouse
for time-series analytics workloads.

### Horizontal Scaling
Deploy backend services using:
Docker + Kubernetes
with load balancing.

This architecture would support **millions of writes per minute efficiently** while maintaining dashboard responsiveness.


#  Author
**Utsav Kumar**

B.Tech CSE (AI)
GitHub:
https://github.com/UtsavInTech
