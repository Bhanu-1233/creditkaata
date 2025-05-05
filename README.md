# 🧾 CrediKhaata - Credit Management System

CrediKhaata is a simple and powerful credit management system for shopkeepers to manage customer credit, loan issuance, repayments, and overdue alerts. This backend API is built using **Node.js**, **Express**, and **MongoDB**, with **JWT authentication** for secure access.

---

## 📌 Features

- ✅ User Authentication (Register, Login with JWT)
- 👥 Customer Management
- 💳 Loan Issuance and Tracking
- 🔁 Repayment History Tracking
- ⚠️ Overdue Loan Alerts
- 📊 Loan Summary Reports
- 🔐 Protected routes with JWT middleware

---

## 🧠 Tech Stack

| Tech         | Description                |
|--------------|----------------------------|
| Node.js      | Backend runtime            |
| Express.js   | RESTful API framework       |
| MongoDB      | Database (via Mongoose)    |
| JWT          | Authentication             |
| Date-fns     | Date handling utilities    |

---

## 🏁 Getting Started

### ✅ Prerequisites

- Node.js & npm installed
- MongoDB (local or Atlas)
- [Postman](https://www.postman.com/) or frontend to test the APIs

### 📦 Installation

```bash
git clone https://github.com/yourusername/credikhaata.git
cd credikhaata
npm install

### ⚙️ Environment Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/credikhaata.git
   cd credikhaata

### Install dependencies:

npm install
Create a .env file in the root with the following variables:

PORT=5000
MONGO_URI=mongodb://localhost:27017/credikhaata
JWT_SECRET=yourSecretKey

npm start
Server will be running at:
http://localhost:5000/api

###🔐 Authentication Routes
🔸 POST /api/auth/register
Register a new user
Body:
{
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
🔸 POST /api/auth/login
Login with credentials
Body:
{
  "email": "test@example.com",
  "password": "password123"
}
Response:
{
  "token": "JWT_TOKEN_HERE"
}
###👥 Customer Routes (Protected)
🔹 POST /api/customers
Create a customer
Body:
{
  "name": "John Doe",
  "phone": "1234567890"
}
🔹 GET /api/customers
List all customers for the authenticated user

💳 Loan Routes (Protected)
🔸 POST /api/loans
### Create a loan
Body:
{
  "customerId": "customerObjectId",
  "amount": 1000,
  "dueDate": "2025-06-01",
  "description": "Loan for groceries"
}
🔸 GET /api/loans
List all loans (optional status filter: paid, overdue)
Example:
/api/loans?status=overdue

🔸 GET /api/loans/user/:userId/loans
List loans by userId (automatically scoped to logged-in user)

🔸 POST /api/loans/:loanId/repay
Repay part of a loan
Body:
{
  "amount": 500,
  "description": "First repayment"
}
📈 Loan Analytics
🔹 GET /api/loans/summary
Returns:

Total loaned

Total collected

Overdue amount

Average repayment time

🔹 GET /api/loans/overdue
Returns a list of overdue loans with customer details

🔐 JWT Middleware
All loan and customer routes are protected using JWT.

Header:
Authorization: Bearer <your_token>
Make sure to include this header after login in all protected requests.

🧪 Testing the API with Postman
Register or log in to get a JWT token.

Set the token in the Authorization header as Bearer <token>.

Test customer and loan routes.

Observe data or error responses in real-time.

###🛠️ Folder Structure

credikhaata/
├── controllers/
├── middleware/
├── models/
│   ├── User.js
│   ├── Customer.js
│   └── Loan.js
├── routes/
│   ├── auth.js
│   ├── customers.js
│   └── loans.js
├── .env
├── server.js
└── package.json
✅ Future Improvements
Email/SMS reminders for overdue loans

Admin dashboard

Role-based access (shop manager, employee)

Export loan reports (PDF/Excel)

###🤝 Contributing
Fork the repository

Create your feature branch:
git checkout -b feature/my-feature

Commit your changes:
git commit -am 'Add new feature'

Push to the branch:
git push origin feature/my-feature

Open a pull request

###📄 License
This project is licensed under the MIT License.
