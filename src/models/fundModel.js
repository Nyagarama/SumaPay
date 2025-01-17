CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fund (
    fund_id SERIAL PRIMARY KEY,
    fund_name VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    group_id INT REFERENCES group(group_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registration (
    registration_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT REFERENCES group(group_id),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE transaction (
    transaction_id SERIAL PRIMARY KEY,
    fund_id INT REFERENCES fund(fund_id),
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);