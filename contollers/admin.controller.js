const sql = require("../database");
const { decodeToken } = require("../utils");
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: 'djper8ctg',
    api_key: '684511326939733',
    api_secret: '70qm4QO6x8KDUOYaam4PdTcDDns'
});

const adminController = {
    createMain: async (req, res) => {
        try {
            const { name, description, logo, seo_tags, address, email, phone, inn } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }

            const uploadedImage = await cloudinary.uploader.upload(logo, {
                folder: 'main_images',  
                public_id: name,        
                fetch_format: 'auto',
                quality: 'auto'
            });

            const logoJson = JSON.stringify({
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id
            });

            const result = await sql`
                INSERT INTO main (name, description, logo, seo_tags, address, email, phone, inn)
                VALUES (${name}, ${description}, ${logoJson}, ${seo_tags}, ${address}, ${email}, ${phone}, ${inn})
                RETURNING *`;

            res.status(201).json({ main: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при создании записи 'Главная'" });
        }
    },

    updateMain: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, logo, seo_tags, address, email, phone, inn } = req.body;

            const mainResult = await sql`SELECT * FROM main WHERE id = ${id}`;
            if (mainResult.length === 0) {
                return res.status(404).json({ message: "Запись 'Главная' не найдена" });
            }

            let logoJson;
            if (logo) {
                const uploadedImage = await cloudinary.uploader.upload(logo, {
                    folder: 'main_images',  
                    public_id: name,        
                    fetch_format: 'auto',
                    quality: 'auto'
                });

                logoJson = JSON.stringify({
                    url: uploadedImage.secure_url,
                    public_id: uploadedImage.public_id
                });
            }

            const result = await sql`
                UPDATE main
                SET
                    name = ${name || mainResult[0].name},
                    description = ${description || mainResult[0].description},
                    logo = ${logoJson ? logoJson : mainResult[0].logo}::jsonb,
                    seo_tags = ${seo_tags || mainResult[0].seo_tags}::json,
                    address = ${address || mainResult[0].address},
                    email = ${email || mainResult[0].email},
                    phone = ${phone || mainResult[0].phone},
                    inn = ${inn || mainResult[0].inn}
                WHERE id = ${id}
                RETURNING *`;

            res.status(200).json({ main: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при обновлении записи 'Главная'" });
        }
    },

    getMain: async (req, res) => {
        try {
            const mainRecords = await sql`SELECT * FROM main`;
            if (mainRecords.length === 0) {
                return res.status(200).json({ message: "Записи 'Главная' не найдены", isCreated: false });
            }

            res.status(200).json({ main: mainRecords, isCreated: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при получении списка записей 'Главная'" });
        }
    },

    createCategory: async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }

            const result = await sql`
                INSERT INTO categories (name)
                VALUES (${name})
                RETURNING *`;

            res.status(201).json({ category: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при создании категории" });
        }
    },
    
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
    
            if (!id || !name) {
                return res.status(400).json({ message: "ID and name are required" });
            }
    
            const result = await sql`
                UPDATE categories
                SET name = ${name}
                WHERE id = ${id}
                RETURNING *`;
    
            if (result.length === 0) {
                return res.status(404).json({ message: "Category not found" });
            }
    
            res.status(200).json({ category: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error updating category" });
        }
    },

deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;

            const categoryResult = await sql`SELECT * FROM categories WHERE id = ${id}`;
            if (categoryResult.length === 0) {
                return res.status(404).json({ message: "Категория не найдена" });
            }

            await sql`DELETE FROM categories WHERE id = ${id}`;

            res.status(200).json({ message: "Категория успешно удалена" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при удалении категории" });
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await sql`SELECT * FROM categories`;
            if (categories.length === 0) {
                return res.status(200).json({ message: "Категории не найдены" });
            }

            res.status(200).json({ categories });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при получении списка категорий" });
        }
    },

    createBanner: async (req, res) => {
        try {
            const { name, img } = req.body;

            if (!name || !img) {
                return res.status(400).json({ message: "Name and image are required" });
            }

            const uploadedImage = await cloudinary.uploader.upload(img, {
                folder: 'banner_images',  
                public_id: name,          
                fetch_format: 'auto',
                quality: 'auto'
            });

            if (!uploadedImage || !uploadedImage.secure_url) {
                return res.status(500).json({ error: "Ошибка при загрузке изображения" });
            }

            const result = await sql`
                INSERT INTO banners (name, img)
                VALUES (${name}, ${uploadedImage.secure_url})
                RETURNING *`;

            res.status(201).json({ banner: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при создании баннера" });
        }
    },
deleteBanner: async (req, res) => {
        try {
            const { id } = req.params;

            // Check if the banner exists
            const bannerResult = await sql`SELECT * FROM banners WHERE id = ${id}`;
            if (bannerResult.length === 0) {
                return res.status(404).json({ message: "Баннер не найден" });
            }

            const banner = bannerResult[0];

            // Extract the public_id from the Cloudinary URL if needed
            const publicId = banner.img.split('/').pop().split('.')[0];

            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(`banner_images/${publicId}`);

            // Delete the banner from the database
            await sql`DELETE FROM banners WHERE id = ${id}`;

            res.status(200).json({ message: "Баннер успешно удален" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при удалении баннера" });
        }
    },
    getBanners: async (req, res) => {
        try {
            const banners = await sql`SELECT * FROM banners`;
            if (banners.length === 0) {
                return res.status(200).json({ message: "Баннеры не найдены" });
            }

            res.status(200).json({ banners });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при получении списка баннеров" });
        }
    },

    // CREATE and GET endpoints for "documents"
    createDocument: async (req, res) => {
        try {
            const { name, content } = req.body;

            if (!name || !content) {
                return res.status(400).json({ message: "Name and content are required" });
            }

            const result = await sql`
                INSERT INTO documents (name, content)
                VALUES (${name}, ${content})
                RETURNING *`;

            res.status(201).json({ document: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при создании документа" });
        }
    },
    updateDocument: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, content } = req.body;

            const documentResult = await sql`SELECT * FROM documents WHERE id = ${id}`;
            if (documentResult.length === 0) {
                return res.status(404).json({ message: "Документ не найден" });
            }
            
            const result = await sql`
                UPDATE documents
                SET
                    name = ${name || documentResult[0].name},
                    content = ${content || documentResult[0].content}
                WHERE id = ${id}
                RETURNING *`;

            res.status(200).json({ document: result[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при обновлении документа" });
        }
    },

    getDocuments: async (req, res) => {
        try {
            const documents = await sql`SELECT * FROM documents`;
            if (documents.length === 0) {
                return res.status(200).json({ message: "Документы не найдены" });
            }

            res.status(200).json({ documents });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Ошибка при получении списка документов" });
        }
    },
};

module.exports = adminController;