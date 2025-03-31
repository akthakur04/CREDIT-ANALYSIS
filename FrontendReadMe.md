```md
# Mortgage Application Frontend

This is the frontend of the Mortgage Application, built using **React (TypeScript)** and **React Router**, with authentication and API calls to a backend.

## 📌 Features
- User authentication (Login/Register)
- Mortgage application form with validation
- List of submitted mortgage applications
- Edit and delete mortgage applications
- Responsive UI with Material UI (MUI)
- State management using React Hooks

## 🚀 Tech Stack
- React (TypeScript)
- React Router
- Material UI (MUI)
- Fetch API for backend communication
-  authentication token management

## 📁 Project Structure
```
src/
│── components/        # Reusable UI components (Header, Login, Register, etc.)
│── pages/             # Page components (Mortgage.tsx)
│── lib/               # Utility functions (utils.ts)
│── styles/            # CSS/SCSS styles
│── App.tsx            # Main App component
│── index.tsx          # Entry point
│── routes.ts          # Application routes
```

## 🔧 Installation & Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/akthakur04/CREDIT-ANALYSIS.git
cd frontend
```

### 2️⃣ Install dependencies
```sh
npm install
# or
yarn install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory and add:
```
REACT_APP_API=<your-backend-url>
```

### 4️⃣ Start the development server
```sh
npm start
# or
yarn start
```

## 🔑 Authentication
- When a user logs in, a **JWT token** is stored in `localStorage`.
- On app load, the token is validated via `GET /api/auth/validate`.

## 📡 API Endpoints Used
- `POST /api/auth/login` → User login
- `POST /api/auth/register` → User registration
- `GET /api/mortgages` → Fetch user's mortgage applications
- `POST /api/mortgages` → Submit new mortgage application
- `DELETE /api/mortgages/:id` → Delete a mortgage application
- `PUT /api/mortgages/:id` → Edit an existing mortgage application

## 🎨 UI Components Used
- **MUI Components** (Card, Input, Button, Badge, Tabs)
- **Lucide Icons** for UI icons
- **Custom hooks & validation** for form handling
