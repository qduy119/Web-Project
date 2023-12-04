const pgp = require("pg-promise")({
    capSQL: true,
});

const connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 30,
};

// Operations for Categories
module.exports = {
    
    getAllCategories: async function() {
        db = pgp({
            ...connection,
            database: process.env.DB_DATABASE,
            max: 30,
        });
        const query = `
            select id, title, description, thumbnail
            from "Categories";
        `;
        return await db.any(query);
    }
}
