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
                return res.status(404).json({ message: "User not found" });
            }

            const { id: userId } = userResult[0];
            const { products, phone_number, first_name, last_name, additional_info } = req.body;

            if (!products || !Array.isArray(products) || products.length === 0 || !phone_number || !first_name || !last_name) {
                return res.status(400).json({ message: "Missing required fields or products array is empty" });
            }

            const productsJson = JSON.stringify(products);

            const orderResult = await sql`
                INSERT INTO orders (user_id, phone_number, first_name, last_name, products, additional_info)
                VALUES (
                    ${userId}, 
                    ${phone_number}, 
                    ${first_name}, 
                    ${last_name}, 
                    ${productsJson}::jsonb,  -- Store the products array as JSONB
                    ${additional_info || null}
                )
                RETURNING *;
            `;

            res.status(201).json({
                message: "Order created!",
                order: orderResult[0],
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
    },
    getUserOrders: async (req, res) => {
        try {
            const [_, token] = req.headers.authorization.split(" ");
            const { email } = decodeToken({ token });

            const userResult = await sql`SELECT * FROM "users" WHERE email = ${email}`;
            if (userResult.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const { id: userId } = userResult[0];

            const userOrders = await sql`SELECT * FROM "orders" WHERE user_id = ${userId}`;
            if (userOrders.length === 0) {
                return res.status(404).json({ message: "No orders found for this user" });
            }

            res.status(200).json(userOrders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

module.exports = orderСontroller;
