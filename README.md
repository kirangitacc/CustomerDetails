# 🧾 Customer Management App

A full-stack web application for managing customer records and their associated addresses. Built with React, Node.js, Express, and SQLite, this app supports user authentication, customer CRUD operations, and responsive UI for both desktop and mobile devices.

---

# deploy link

https://customer-details.vercel.app/

---

## 🚀 Features

- 🔐 JWT-based user authentication (register/login)
- 👤 Create, view, update, and delete customers
- 🏠 Manage multiple addresses per customer
- 📱 Responsive design with mobile-first layout
- 🔍 Filter customers by city, state, and pin code
- 📦 SQLite database with normalized schema

---

## 🛠 Tech Stack

| Layer        | Technology            |
|--------------|------------------------|
| Frontend     | React, CSS Modules     |
| Backend      | Node.js, Express       |
| Database     | SQLite (via `sqlite3`) |
| Auth         | JWT, bcrypt            |

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/customer-management-app.git
cd customer-management-app
```

### 2. Install dependencies

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd frontend
npm install
```

---

## ⚙️ Running the App

### Start Backend
```bash
cd backend
node server.js
```

### Start Frontend
```bash
cd frontend
npm start
```

- App will run at: **http://localhost:3000**  
- Backend API runs at: **http://localhost:3001**

---

## 🔐 Authentication

- Register a new user via **/register**
- Login via **/login** to receive a JWT token
- Token is stored in `localStorage` and sent with each request via  
  `Authorization: Bearer <token>`

---

## 🗄 Database Schema

### userdetails
| Field    | Type     |
|----------|----------|
| id       | INTEGER  |
| username | TEXT     |
| email    | TEXT     |
| password | TEXT     |
| gender   | TEXT     |
| phone    | TEXT     |
| address  | TEXT     |

### customers
| Field            | Type     |
|------------------|----------|
| id               | INTEGER  |
| first_name       | TEXT     |
| last_name        | TEXT     |
| phone            | TEXT     |
| email            | TEXT     |
| only_one_address | INTEGER  |

### addresses
| Field        | Type     |
|--------------|----------|
| id           | INTEGER  |
| customer_id  | INTEGER  |
| address_line | TEXT     |
| city         | TEXT     |
| state        | TEXT     |
| pin_code     | TEXT     |

---

## 📱 Responsive Design Notes

- `CustomerForm` adapts to screen size  
- On small screens:  
  - Customer details are fixed at top  
  - Address container scrolls within **30vh**  
  - Submit button is fixed at bottom  
  - Overall form height: **82vh**  

---

## 📂 Folder Structure

```
project-root/
├── backend/
│   ├── server.js
│   └── customer.db
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerForm.js
│   │   │   ├── CustomerList.js
│   │   │   ├── CustomerDetails.js
│   │   │   ├── Header.js
│   │   │   └── Loader.js
│   │   └── index.css
│   └── public/
└── README.md
```

---

## 🧪 Testing

- Manual testing via browser.  
- Future enhancements may include:  
  - Unit tests with Jest  
  - Integration tests with Cypress  

---

## 📌 To-Do

- [ ] Add sorting by name or address count  
- [ ] Export customer data to CSV  
- [ ] Role-based access control  
