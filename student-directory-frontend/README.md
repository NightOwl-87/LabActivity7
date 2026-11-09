# Student Directory Application

## Project Description

The Student Directory Application is a React frontend connected to an existing Express.js and MongoDB backend. It allows users to register an account, log in, and view the student directory after successful authentication.

The application uses JWT (JSON Web Token) authentication to protect student data and prevent unauthorized access.

## Technologies Used

- React
- Vite
- React Router DOM
- JavaScript
- CSS
- Express.js
- MongoDB Atlas
- JWT Authentication

## Features

- User registration
- User login and logout
- JWT authentication
- Token persistence using localStorage
- Protected student directory
- Automatic redirect for unauthenticated users
- Student list with loading and error states
- Authorization header when requesting student data

## Project Setup

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Visual Studio Code
- MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd student-directory-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Backend

The application requires the Express student index.js backend to be running.

In the backend project folder, create or check your `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Do not upload your actual `.env` file or expose your database credentials.

Make sure the backend has CORS configured to allow requests from:

```text
http://localhost:5173
```

The backend should also expose these routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/students`

### 4. Start the Backend

Open a terminal in the backend folder and run:

```bash
node index.js
```

### 5. Start the React Frontend

Open another terminal in the frontend folder and run:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## Application Routes

| Route | Description |
|---|---|
| `/` | Redirects based on authentication status |
| `/login` | User login page |
| `/register` | User registration page |
| `/students` | Protected student directory |

## Authentication

The application uses an AuthContext to manage the user's authentication state.

After a successful login, the JWT is saved in localStorage. The token is then included in the Authorization header when requesting student data.

If the token is missing, invalid, or expired, the backend rejects the request and the frontend redirects the user to the login page.

## Project Screenshots

Screenshots are saved in the `screenshots` folder.

1. Login Page: `screenshots/login.png`
2. Registration Page: `screenshots/register.png`
3. Successful Student Directory: `screenshots/students.png`
4. Failed Login: `screenshots/failed-login.png`
5. Protected Route Redirect: `screenshots/protected-route.png`
6. Authorization Header: `screenshots/network-token.png`

## Reflection Questions

### 1. Why is localStorage used to store the JWT? What is one risk of this approach, and what is a more secure alternative?

localStorage is used to keep the JWT even after the browser is refreshed, so users do not have to log in every time they open the application. However, one risk is that JavaScript can access localStorage, which means an attacker could steal the token if the application has a cross-site scripting (XSS) vulnerability. A more secure alternative is using an HttpOnly cookie because JavaScript cannot directly access it. This helps reduce the risk of token theft through XSS.

### 2. What is the purpose of AuthContext, and why is it better than passing authentication data through props?

AuthContext allows the application to share authentication information, such as the user and JWT, with different components. It makes it easier to access login, logout, and authentication status without passing the same information through multiple components. Passing data through many levels of components can make the code harder to maintain. Using Context makes authentication management more organized and easier to handle.

### 3. What should happen in the frontend when a JWT expires?

When the JWT expires, the backend should reject requests that require authentication. The frontend should detect the unauthorized response, clear the expired token from localStorage, and update the authentication state. The user should then be redirected to the login page. This allows the user to log in again and receive a new token.

### 4. What is the difference between backend requireAuth middleware and frontend ProtectedRoute? Why are both needed?

The backend requireAuth middleware checks whether a request contains a valid JWT before allowing access to protected API routes. The frontend ProtectedRoute prevents users who are not logged in from accessing protected pages, such as the student directory. However, frontend protection alone is not enough because users can still make direct API requests outside the application. Both are needed to protect the user experience and secure the backend data.

## Author
Christian Borlaza

Student Directory Application Project