
CREATE TABLE PRODUCTS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    detailed_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    tags VARCHAR(255),
    category VARCHAR(255),
    images JSON
);

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    images JSON,
    content TEXT
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL, 
    phone_number VARCHAR(20) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    products JSONB NOT NULL, 
    additional_info TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE FEEDBACK (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    text TEXT
);

   
