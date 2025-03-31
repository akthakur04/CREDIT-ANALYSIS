
# **Mortgage API - FastAPI**
This is a FastAPI-based Mortgage API that allows users to register, authenticate, and manage their mortgage applications. The API includes authentication, CRUD operations for mortgages, and a credit rating calculation system.

## **Table of Contents**
- [**Installation**](#installation)
- [**Running the Application**](#running-the-application)
- [**Environment Variables**](#environment-variables)
- [**API Routes**](#api-routes)
  - [Auth Routes](#auth-routes)
  - [Mortgage Routes](#mortgage-routes)

---

## **Installation**
### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd mortgage-api
```

### **2. Create a Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
```

### **3. Install Dependencies**
```bash
pip install -r requirements.txt
```

---

## **Running the Application**
1. **Set up the database:** Ensure you have a MySQL database running and update the `.env` file accordingly.
2. **Run the FastAPI server:**
   ```bash
   uvicorn app:app --reload
   ```
3. The API will be available at:  
   **http://127.0.0.1:8000**

4. You can test the API using Swagger UI:  
   **http://127.0.0.1:8000/docs**

---

## **Environment Variables**
Create a `.env` file in the root directory and add the following:

```ini
SECRET_KEY=your_secret_key
DATABASE_URL=mysql+pymysql://root:root123@localhost/mortgage_db
```

---

## **API Routes**
### **Auth Routes**
#### **1. Register a New User**
**Endpoint:** `POST /api/auth/register`  
Registers a new user.

**Request Body:**
```json
{
  "username": "testuser",
  "password_hash": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

---

#### **2. Login**
**Endpoint:** `POST /api/auth/login`  
Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "testuser",
  "password_hash": "password123"
}
```

**Response:**
```json
{
  "access_token": "<jwt_token>",
  "token_type": "bearer"
}
```

---

#### **3. Validate User Session**
**Endpoint:** `GET /api/auth/validate`  
Validates the logged-in user and fetches their mortgages.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Response:**
```json
{
  "username": "testuser",
  "mortgages": []
}
```

---

#### **4. Logout**
**Endpoint:** `POST /api/auth/logout`  
Logs out a user (token invalidation not implemented yet).

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### **Mortgage Routes**
#### **5. Add a Mortgage**
**Endpoint:** `POST /api/mortgages`  
Adds a mortgage for the authenticated user.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Request Body:**
```json
{
  "credit_score": 750,
  "loan_amount": 200000,
  "property_value": 250000,
  "annual_income": 50000,
  "debt_amount": 10000,
  "loan_type": "fixed",
  "property_type": "house"
}
```

**Response:**
```json
{
  "id": 1,
  "credit_score": 750,
  "loan_amount": 200000,
  "property_value": 250000,
  "annual_income": 50000,
  "debt_amount": 10000,
  "loan_type": "fixed",
  "property_type": "house",
  "credit_rating": "AAA"
}
```

---

#### **6. Get All Mortgages**
**Endpoint:** `GET /api/mortgages`  
Retrieves all mortgages for the authenticated user.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Response:**
```json
[
  {
    "id": 1,
    "credit_score": 750,
    "loan_amount": 200000,
    "property_value": 250000,
    "annual_income": 50000,
    "debt_amount": 10000,
    "loan_type": "fixed",
    "property_type": "house",
    "credit_rating": "AAA"
  }
]
```

---

#### **7. Update a Mortgage**
**Endpoint:** `PUT /api/mortgages/{mortgage_id}`  
Updates an existing mortgage.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Request Body (only fields to update):**
```json
{
  "loan_amount": 220000
}
```

**Response:**
```json
{
  "credit_score": 750,
  "loan_amount": 220000,
  "property_value": 250000,
  "annual_income": 50000,
  "debt_amount": 10000,
  "loan_type": "fixed",
  "property_type": "house"
}
```

---

#### **8. Delete a Mortgage**
**Endpoint:** `DELETE /api/mortgages/{mortgage_id}`  
Deletes a mortgage record.

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Response:**
```json
{
  "message": "Mortgage deleted successfully"
}
```

---

## **Logging**
All important actions are logged to `app.log` file.

---
