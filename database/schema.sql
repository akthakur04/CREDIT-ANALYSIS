-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Create mortgages table
CREATE TABLE mortgages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    credit_score INT NOT NULL,
    loan_amount FLOAT NOT NULL,
    property_value FLOAT NOT NULL,
    annual_income FLOAT NOT NULL,
    debt_amount FLOAT NOT NULL,
    loan_type VARCHAR(255) NOT NULL,
    property_type VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
