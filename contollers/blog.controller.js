const sql = require("../database");
const { decodeToken } = require("../utils");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "djper8ctg",
	api_key: "684511326939733",
	api_secret: "70qm4QO6x8KDUOYaam4PdTcDDns",
});

const blogController = {
	createBlog: async (req, res) => {
		try {
			const { title, content, images, tags } = req.body;

			const uploadedImage = await cloudinary.uploader.upload(images, {
				folder: "blog_images",
				public_id: title,
				fetch_format: "auto",
				quality: "auto",
			});

			const imageJson = JSON.stringify({
				url: uploadedImage.secure_url,
				public_id: uploadedImage.public_id,
			});

			const result = await sql`
                INSERT INTO blogs (title, images, content, tags)
                VALUES (${title}, ${imageJson}::jsonb, ${content}, ${tags})
                RETURNING *`;

			res.status(201).json({ blog: result[0] });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Ошибка при создании блога" });
		}
	},

	getAllBlogs: async (req, res) => {
		try {
			const result = await sql`
                SELECT * FROM blogs`;

			if (result.length === 0) {
				return res
					.status(200)
					.json({ message: "Блоги не найдены", blogs: [] });
			}

			res.json({ blogs: result });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: "Ошибка при получении списка блогов",
			});
		}
	},

	updateBlog: async (req, res) => {
		try {
			const { id } = req.params;
			const { title, content, images } = req.body;

			const uploadedImage = await cloudinary.uploader.upload(images, {
				folder: "blog_images",
				public_id: title,
				fetch_format: "auto",
				quality: "auto",
			});

			const imageJson = JSON.stringify({
				url: uploadedImage.secure_url,
				public_id: uploadedImage.public_id,
			});

			const result = await sql`
                UPDATE blogs
                SET
                    title = ${title},
                    images = ${imageJson}::jsonb,
                    content = ${content}
                WHERE id = ${id}
                RETURNING *`;

			if (result.length === 0) {
				return res.status(404).json({ message: "Блог не найден" });
			}

			res.json({ blog: result[0] });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Ошибка при обновлении блога" });
		}
	},

	deleteBlog: async (req, res) => {
		try {
			const { id } = req.params;

			const result = await sql`
                DELETE FROM blogs
                WHERE id = ${id}
                RETURNING *`;

			if (result.length === 0) {
				return res.status(404).json({ message: "Блог не найден" });
			}

			res.json({ message: "Блог успешно удален" });
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Ошибка при удалении блога" });
		}
	},
};

module.exports = blogController;
