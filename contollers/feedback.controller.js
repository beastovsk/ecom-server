const sql = require("../database");
const { decodeToken } = require("../utils");

const feedbackController = {
    createFeedback: async (req, res) => {
        try {
            const [_, token] = req.headers.authorization.split(" ");
            const { email } = decodeToken({ token });

            const userResult = await sql`SELECT * FROM "users" WHERE email = ${email}`;
            if (userResult.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const { id: userId } = userResult[0];
            const { name, email: feedbackEmail, text } = req.body;

            if (!name || !feedbackEmail || !text) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const result = await sql`
                INSERT INTO feedback (user_id, name, email, text)
                VALUES (${userId}, ${name}, ${feedbackEmail}, ${text})
                RETURNING *`;

            res.status(201).json({ feedback: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при создании отзыва" });
        }
    },

    getAllFeedbacks: async (req, res) => {
        try {
            const feedbacks = await sql`SELECT * FROM feedback`;
            if (feedbacks.length === 0) {
                return res.status(200).json({ message: "Отзывы не найдены" });
            }

            res.status(200).json({ feedbacks });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при получении списка отзывов" });
        }
    },
};

module.exports = feedbackController;