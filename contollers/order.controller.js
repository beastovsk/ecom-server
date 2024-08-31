const sql = require("../database");
const bcrypt = require("bcryptjs");
const { generateToken, decodeToken } = require("../utils");


const orderСontroller = {
    createOrder: async (req, res) => {
        try {
            const [_, token] = req.headers.authorization.split(" ");
            
            const { email } = decodeToken({ token });
            
            const userResult = await sql`SELECT * FROM "users" WHERE email = ${email}`;
            if (userResult.length === 0) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }

            const { id: userId } = userResult[0];

            const { product_id, phone_number, first_name, last_name, additional_info } = req.body;

            if (!product_id || !phone_number || !first_name || !last_name) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const result = await sql`
                INSERT INTO orders (phone_number, first_name, last_name, product_id, user_id, additional_info)
                VALUES (${phone_number}, ${first_name}, ${last_name}, ${product_id}, ${userId}, ${additional_info || null})
                RETURNING *;
            `;

            res.status(201).json({
                message: "Заказ составлен!",
                order: result[0],
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }, 
    getAllOrders: async (req, res) => {
        try {
            const orders = await sql`SELECT * FROM "orders"`;
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getOrderById: async (req, res) => {
        try {
            const { id } = req.params;

            const orderResult = await sql`SELECT * FROM "orders" WHERE id = ${id}`;
            if (orderResult.length === 0) {
                return res.status(404).json({ message: "Order not found" });
            }

            res.status(200).json(orderResult[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

module.exports = orderСontroller;
