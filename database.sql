
CREATE TABLE PRODUCTS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    detailed_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    tags VARCHAR(255),
    category VARCHAR(255),
    images TEXT
);

CREATE TABLE BLOGS (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    content TEXT
);

CREATE TABLE ORDERS (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    products TEXT, 
    additional_info TEXT
);

CREATE TABLE FEEDBACK (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    text TEXT
);

   
