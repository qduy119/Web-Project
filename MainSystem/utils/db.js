const fs = require("fs");

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

let db = pgp(connection);

async function createCategories() {
    const query = `
        create table "Categories" (
            id integer not null,
            title text,
            description text,
            thumbnail text,
            primary key (id)
        )
    `;
    await db.none(query);
}

async function createProducts() {
    const query = `
        create table "Products" (
            id integer not null,
            "categoryId" integer not null,
            title text,
            description text,
            price real,
            "discountPercentage" real,
            stock integer,
            brand text,
            thumbnail text,
            images text[],
            foreign key ("categoryId") references "Categories" (id),
            primary key (id)
        )
    `;
    await db.none(query);
}

async function createUsers() {
    const query = `
        create table "Users" (
            id integer not null,
            email text not null,
            password text not null,
            role text default 'user'::text,
            username text not null,
            avatar text default 'https://res.cloudinary.com/dlzyiprib/image/upload/v1700326876/e-commerces/user/download_ae0aln.png'::text,
            gender text,
            dob date,
            primary key (id)
        )
    `;
    await db.none(query);
}

async function createCartDetails() {
    const query = `
        create table "CartDetails" (
            id integer not null,
            "userId" integer not null,
            "productId" integer not null,
            quantity integer not null,
            foreign key ("userId") references "Users" (id),
            foreign key ("productId") references "Products" (id),
            primary key (id)
        )
    `;
    await db.none(query);
}

async function createOrders() {
    const query = `
        create table "Orders" (
            id integer not null,
            "userId" integer not null,
            date date not null,
            total real not null,
            status text not null,
            foreign key ("userId") references "Users" (id),
            primary key (id)
        )
    `;
    await db.none(query);
}

async function createOrderDetails() {
    const query = `
        create table "OrderDetails" (
            id integer not null,
            "orderId" integer not null,
            "productId" integer not null,
            quantity integer not null,
            foreign key ("orderId") references "Orders" (id),
            foreign key ("productId") references "Products" (id),
            primary key (id)
        )
    `;
    await db.none(query);
}

async function createPayments() {
    const query = `
        create table "Payments" (
            id integer not null,
            "orderId" integer not null,
            "userId" integer not null,
            date date not null,
            method text not null,
            amount real not null,
            status text not null,
            foreign key ("orderId") references "Orders" (id),
            foreign key ("userId") references "Users" (id),
            primary key (id)
        )
    `;
    await db.none(query);
}

async function createReviews() {
    const query = `
        create table "Reviews" (
            id integer not null,
            "userId" integer not null,
            content text,
            rate integer,
            date date,
            foreign key ("userId") references "Users" (id),
            primary key (id)
        )
    `;
    await db.none(query);
}

async function createTable() {
    await createCategories();
    await createProducts();
    await createUsers();
    await createCartDetails();
    await createOrders();
    await createOrderDetails();
    await createPayments();
    await createReviews();
}

async function importData() {
    const data = JSON.parse(fs.readFileSync("data/data.json"));
    const { Categories, Products } = data;
    await insertBulk("Categories", Categories);
    await insertBulk("Products", Products);
}

async function isDBExist() {
    try {
        const isExist = await db.any(
            `select * from pg_database where datname = $1`,
            [process.env.DB_DATABASE]
        );
        return isExist.length > 0;
    } catch (err) {
        console.log(err.message);
    }
}

async function insertBulk(tableName, entity) {
    try {
        let keys = [];
        if (entity.length > 0) {
            keys = Object.keys(entity[0]);
        }
        const query = pgp.helpers.insert(entity, keys, tableName);
        const data = await db.many(query + " RETURNING *");
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function connectDB() {
    try {
        let flag = 0;
        if (!(await isDBExist())) {
            await db.none(`create database "${process.env.DB_DATABASE}"`);
            db = pgp({
                ...connection,
                database: process.env.DB_DATABASE,
                max: 30,
            });
            flag = 1;
            // create table
            await createTable();
            // import data to db
            await importData();
            console.log("Import data successfully");
        }
        if (!flag) {
            db = pgp({
                ...connection,
                database: process.env.DB_DATABASE,
                max: 30,
            });
        }
    } catch (err) {
        console.log(err.message);
    }
}

const categoryOperations = {
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
    },
    insertCategory: async function(category) {
        try {
            let id = await executeScalar(`select max("id") from "Categories"`);
            id = parseInt(id) + 1;
            const query =  `insert into "Categories" ("id", "title", "description", "thumbnail") values('${id}', '${category.title}', '${category.description}', '${category.thumbnail}')`;
    
            const data = await db.many(query + " RETURNING *");
            return data;
        } catch (err) {
            console.error(err);
        }
    }
}

// async function executeNonQuery(command) {
//     try {
//         await this.connection.none(command);
//     } catch(err) {
//         console.log(err);
//         throw err;
//     }
// }
// async function executeReader(command) {
//     try {
//         let res = await this.connection.any(command);
//         return res;
//     } catch(err) {
//         console.log(err);
//         throw err;
//     }
// }
async function executeScalar(command) {
    try {
        const result = await db.one(command);
        return result[Object.keys(result)[0]];
    } catch(err) {
        console.log(err);
        throw err;
    }
}


module.exports = {
    connectDB,
    categoryOperations
};