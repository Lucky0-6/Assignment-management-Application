# Assignment-management-Application
# Assignment Management Application

A robust full-stack application designed to manage users, courses, and assignments. The backend is built with Node.js and Express, utilizing a dynamic SQL Server integration that executes stored procedures based on mapped IDs.

## 🚀 Features

- **JWT Authentication**: Secure login and protected routes using JSON Web Tokens.
- **Dynamic Procedure Execution**: A centralized service to execute SQL Server stored procedures using `procID` mapping, reducing boilerplate code.
- **Procedure Caching**: Optimized performance by caching procedure name lookups.
- **Scalable Architecture**: Decoupled controllers, services, and routes.
- **Frontend Integration**: Static file serving for the frontend interface.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Microsoft SQL Server (MSSQL)
- **Security**: JSON Web Tokens (JWT), CORS
- **Frontend**: HTML/JavaScript (Static)

## 📂 Project Structure

```text
Backend/
├── config/             # Database configuration
├── controllers/        # Request handlers (User, Course, Assignment)
├── routes/             # API route definitions
├── services/           # Business logic (Auth, Procedure Executor)
└── server.js           # Application entry point
Frontend/               # Client-side files (index.html, etc.)
```

## ⚙️ Setup and Installation

1. **Clone the repository**

2. **Install Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Configuration**
   - Ensure your SQL Server is running.
   - Configure your database connection in `Backend/config/db.js`.
   - Update the `SECRET_KEY` in `Backend/controllers/UserController.js` and `Backend/services/auth.js` (Note: Moving these to a `.env` file is recommended for production).

4. **Run the Application**
   ```bash
   node server.js
   ```
   The server will start on `http://localhost:3000`.

## 🛣️ API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/login` | Authenticate user and receive JWT | No |

### Data Operations (Execute Procedures)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/execute-user` | Execute user-related procedures | Yes |
| POST | `/api/execute-course` | Execute course-related procedures | Yes |
| POST | `/api/execute-assignment` | Execute assignment-related procedures | Yes |

**Request Body Example:**
```json
{
  "procID": 1,
  "param1": "value",
  "param2": 123
}
```

## 🔒 Security

Protected routes require an `Authorization` header containing a valid JWT token. The backend verifies the token before allowing access to the procedure execution logic.
