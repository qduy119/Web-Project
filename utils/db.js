const fs = require("fs");

const pgp = require("pg-promise")({
    capSQL: true,
});

const connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 30,
};

let db = pgp(connection);

async function createCategories() {
    const query = `
            create table "Categories" (
                  id serial not null,
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
                  id serial not null,
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
                  id text not null,
                  username text,
                  password text,
                  email text,
                  role text default 'customer'::text,
                  avatar text default 'https://res.cloudinary.com/dlzyiprib/image/upload/v1700326876/e-commerces/user/download_ae0aln.png'::text,
                  "fullName" text,
                  primary key (id)
            )
      `;
    await db.none(query);
}

async function createCartDetails() {
    const query = `
            create table "CartDetails" (
                  id serial not null,
                  "userId" text not null,
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
            id serial not null,
            "userId" text not null,
            "orderDate" timestamptz not null,
            "totalPrice" real not null,
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
            id serial not null,
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
            id serial not null,
            "orderId" integer not null,
            "userId" text not null,
            "paymentDate" date not null,
            amount real not null,
            status text not null,
            message text,
            foreign key ("orderId") references "Orders" (id),
            foreign key ("userId") references "Users" (id),
            primary key (id)
        )
    `;
    await db.none(query);
}

const createPaymentAccount = async () => {
    const query = `
            create table "paymentAccount" (
                  id serial not null,
                  "creditBalance" real not null default 100000.0,
                  "userId" text,
                  primary key (id),
                  foreign key ("userId") references "Users" (id)
            )
      `;
    await db.none(query);
};

const insertDefaultMainAccount = async () => {
    await db.none(`
        insert into "paymentAccount"("userId") values(null)
    `)
}

const createHistoryTransfer = async () => {
    await db.none(`
            create table "historyTransfer" (
                  id serial not null,
                  "dateTransfer" date not null,
                  "creditId" integer not null,
                  amount real not null,
                  "balanceAfterTransfer" real not null,
                  foreign key ("creditId") references "paymentAccount" (id),
                  primary key (id)
            )
      `);
};

async function createTable() {
    await createCategories();
    await createProducts();
    await createUsers();
    await createCartDetails();
    await createOrders();
    await createOrderDetails();
    await createPayments();
    await createPaymentAccount();
    await createHistoryTransfer();
}

async function importData() {
    const data = JSON.parse(fs.readFileSync("data/data.json"));
    const { Categories, Products } = data;
    await insertBulk("Categories", Categories);
    await insertBulk("Products", Products);
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
        const result = await db.one("SELECT NOW()");
        console.log("Connected to the database:", result.now);
        // await db.none(str)
    } catch (error) {
        delete connection.database;
        db = pgp(connection);
        await db.none(`create database "${process.env.DB_DATABASE}"`);
        connection.database = process.env.DB_DATABASE;
        db = pgp(connection);

        const result = await db.one("SELECT NOW()");
        console.error("Connected to the database : ", result.now);
        //neu nhu db moi tao ta insert data
        await createTable();
        await importData();
        await insertDefaultMainAccount();
    }
}


module.exports = {
    connectDB : connectDB,
    db : db
}

/**
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
                  console.log("ton tai db ");
                  db = pgp({
                        ...connection,
                        database: process.env.DB_DATABASE,
                        max: 30,
                  });
            }
      } catch (err) {
            console.log(err.message);
      }

INSERT INTO "Users"(email, password, role, username, avatar, gender, dob) VALUES
('user1@example.com', 'password1', 'user', 'username1', 'avatar1.png', 'Male', '1990-05-15'),
('user2@example.com', 'password2', 'user', 'username2', 'avatar2.png', 'Female', '1992-10-22'),
('user3@example.com', 'password3', 'user', 'username3', 'avatar3.png', 'Male', '1987-07-30'),
('user4@example.com', 'password4', 'user', 'username4', 'avatar4.png', 'Female', '1995-03-18'),
('user5@example.com', 'password5', 'user', 'username5', 'avatar5.png', 'Male', '1988-11-25'),
('user6@example.com', 'password6', 'user', 'username6', 'avatar6.png', 'Female', '1991-09-03'),
('user7@example.com', 'password7', 'user', 'username7', 'avatar7.png', 'Male', '1989-12-12'),
('user8@example.com', 'password8', 'user', 'username8', 'avatar8.png', 'Male', '1994-06-28'),
('user9@example.com', 'password9', 'user', 'username9', 'avatar9.png', 'Female', '1997-02-14'),
('user10@example.com', 'password10', 'user', 'username10', 'avatar10.png', 'Male', '1996-08-07')

(1,'2022-12-12', 1, 123.3),
(2, '2023-10-12', 1, 123.3),
(3, '2022-4-12', 7, 123.3),
(4, '2023-12-12', 5, 123.3),
(5,'2022-3-12', 8, 123.3),
(6,'2023-7-12', 6, 123.3),
(7,'2023-12-12', 1, 123.3),
(8,'2023-1-12', 1, 123.3),
(9.'2023-3-12', 1, 123.3),
(10,'2023-2-12', 2, 123.3),
(11,'2022-4-12', 2, 123.3),
(12,'2023-1-12', 2, 123.3),
(13,'2022-3-12', 1, 123.3),
(14,'2023-2-12', 2, 123.3),
(15,'2022-12-12', 2, 123.3),
(16,'2022-12-12', 2, 123.3),
(17,'2023-12-12', 8, 123.3),
(18,'2023-5-12', 3, 123.3),
(19,'2023-8-12', 9, 123.3),
(20,'2023-12-12', 9, 123.3),
(21,'2023-12-12', 9, 123.3),
(22,'2023-3-12', 7, 123.3),
(23,'2022-12-12', 3, 123.3),
(24,'2023-4-12', 3, 123.3),
(25,'2022-1-12', 4, 123.3),
(26,'2023-1-12', 10, 123.3),
(27,'2022-12-12',5, 123.3),
(28,'2023-1-12', 9, 123.3),
(29,'2023-4-12', 4, 123.3),
(30,'2023-5-12', 4, 123.3),
(31,'2023-5-12', 4, 123.3),
(32,'2022-1-12', 5, 123.3),
(33,'2022-5-12', 5, 123.3),
(34,'2022-2-12', 5, 123.3),
(35,'2023-5-12', 5, 123.3),
(36,'2023-1-12', 10, 123.3),
(37,'2023-9-12', 9, 123.3),
(38,'2023-8-12', 1, 123.3),
(39,'2023-5-12', 5, 123.3),
(40,'2022-3-12', 6, 123.3),
(41,'2023-5-12', 9, 123.3),
(42,'2023-5-12', 1, 123.3),
(43,'2023-5-12', 2, 123.3),
(44,'2023-5-12', 3, 123.3),
(45,'2023-5-12', 4, 123.3),
(46,'2023-5-12', 9, 123.3),
(47,'2022-5-12', 6, 123.3),
(48,'2023-5-12', 9, 123.3),
(49,'2022-5-12', 10, 123.3),
(50,'2023-5-12', 6, 123.3)

('2022-12-12', 1, 123.3, 'yes'),
('2023-10-12', 1, 123.3, 'yes'),
('2022-4-12', 7, 123.3, 'yes'),
('2023-12-12', 5, 123.3, 'yes'),
('2022-3-12', 8, 123.3, 'yes'),
('2023-7-12', 6, 123.3, 'yes'),
('2023-12-12', 1, 123.3, 'yes'),
('2023-1-12', 1, 123.3, 'yes'),
('2023-3-12', 1, 123.3, 'yes'),
('2023-2-12', 2, 123.3, 'yes'),
('2022-4-12', 2, 123.3, 'yes'),
('2023-1-12', 2, 123.3, 'yes'),
('2022-3-12', 1, 123.3, 'yes'),
('2023-2-12', 2, 123.3, 'yes'),
('2022-12-12', 2, 123.3, 'yes'),
('2022-12-12', 2, 123.3, 'yes'),
('2023-12-12', 8, 123.3, 'yes'),
('2023-5-12', 3, 123.3, 'yes'),
('2023-8-12', 9, 123.3, 'yes'),
('2023-12-12', 9, 123.3, 'yes'),
('2023-12-12', 9, 123.3, 'yes'),
('2023-3-12', 7, 123.3, 'yes'),
('2022-12-12', 3, 123.3, 'yes'),
('2023-4-12', 3, 123.3, 'yes'),
('2022-1-12', 4, 123.3, 'yes'),
('2023-1-12', 10, 123.3, 'yes'),
('2022-12-12',5, 123.3, 'yes'),
('2023-1-12', 9, 123.3, 'yes'),
('2023-4-12', 4, 123.3, 'yes'),
('2023-5-12', 4, 123.3, 'yes'),
('2023-5-12', 4, 123.3, 'yes'),
('2022-1-12', 5, 123.3, 'yes'),
('2022-5-12', 5, 123.3, 'yes'),
('2022-2-12', 5, 123.3, 'yes'),
('2023-5-12', 5, 123.3, 'yes'),
('2023-1-12', 10, 123.3, 'yes'),
('2023-9-12', 9, 123.3, 'yes'),
('2023-8-12', 1, 123.3, 'yes'),
('2023-5-12', 5, 123.3, 'yes'),
('2022-3-12', 6, 123.3, 'yes'),
('2023-5-12', 9, 123.3, 'yes'),
('2023-5-12', 1, 123.3, 'yes'),
('2023-5-12', 2, 123.3, 'yes'),
('2023-5-12', 3, 123.3, 'yes'),
('2023-5-12', 4, 123.3, 'yes'),
('2023-5-12', 9, 123.3, 'yes'),
('2022-5-12', 6, 123.3, 'yes'),
('2023-5-12', 9, 123.3, 'yes'),
('2022-5-12', 10, 123.3, 'yes'),
('2023-5-12', 6, 123.3, 'yes')
 */
