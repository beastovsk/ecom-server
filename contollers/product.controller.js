const sql = require("../database");
const bcrypt = require("bcryptjs");
const { generateToken, decodeToken } = require("../utils");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'djper8ctg',
    api_key: '684511326939733',
    api_secret: '70qm4QO6x8KDUOYaam4PdTcDDns'  
  });

const orderСontroller = {
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;

            const result = await sql`
                SELECT * FROM "products"
                WHERE id = ${id}`;
    
            if (result.length === 0) {
                return res.status(404).json({ message: "Продукт не найден" });
            }
    
            res.json({ product: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при получении продукта" });
        }
    },
    getAllProducts: async (req, res) => {
        try {
            const result = await sql`
                SELECT * FROM "products"`;
    
            if (result.length === 0) {
                return res.status(200).json({ message: "Продукты не найдены" });
            }
    
            res.json({ products: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при получении списка продуктов" });
        }
    },
	createProduct: async (req, res) => {
        try {
          const { name, description, detailed_description, price, tags, category, images } = req.body;
    
       const uploadedImage = await cloudinary.uploader.upload(images, {
        folder: 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
        public_id: name,  
        fetch_format: 'auto', 
        quality: 'auto' 
      });
    
          const imageUrl = uploadedImage.secure_url;
          const result = await sql`
              INSERT INTO "products" (name, description, detailed_description, price, tags, category, images)
              VALUES (${name}, ${description}, ${detailed_description}, ${price}, ${tags}, ${category}, ${imageUrl})
              RETURNING *`;
    
          res.status(201).json({ product: result[0] });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Ошибка при создании продукта" });
        }
      },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, detailed_description, price, tags, category, images } = req.body;
    
            const uploadedImage = await cloudinary.uploader.upload(images, {
                folder: 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
                public_id: name,  
                fetch_format: 'auto', 
                quality: 'auto' 
              });

              const imageUrl = uploadedImage.secure_url;


            const result = await sql`
                UPDATE "products"
                SET
                    name = ${name},
                    description = ${description},
                    detailed_description = ${detailed_description},
                    price = ${price},
                    tags = ${tags},
                    category = ${category},
                    images = ${imageUrl}
                WHERE id = ${id}
                RETURNING *`;
    
            if (result.length === 0) {
                return res.status(404).json({ message: "Продукт не найден" });
            }
    
            res.json({ product: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при обновлении продукта" });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
    
            const result = await sql`
                DELETE FROM "products"
                WHERE id = ${id}
                RETURNING *`;
    
            if (result.length === 0) {
                return res.status(404).json({ message: "Продукт не найден" });
            }
    
            res.json({ message: "Продукт успешно удален" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при удалении продукта" });
        }
    },
};

module.exports = orderСontroller;
