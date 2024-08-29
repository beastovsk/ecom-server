
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

-- Создание таблицы для хранения информации о блогах
CREATE TABLE BLOGS (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    content TEXT
);

-- Создание таблицы для хранения информации о заказах
CREATE TABLE ORDERS (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    products TEXT, -- Здесь можно хранить JSON строку с информацией о продуктах в заказе
    additional_info TEXT
);

-- Создание таблицы для хранения отзывов
CREATE TABLE FEEDBACK (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    text TEXT
);

   
