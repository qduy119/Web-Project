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
                  id serial not null,
                  email text not null,
                  password text  UNIQUE,
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
                  id serial not null,
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
            id serial not null,
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
            id serial not null,
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

const createPaymentAccount = async () => {
      const query = `
            create table "paymentAccount" (
                  id serial not null,
                  "creditBalance" real not null default 100000.0,
                  primary key (id),
                  foreign key (id) references "Users" (id)
            )
      `
      await db.none(query);
}

const createHistoryTransfer = async () => {
      await db.none(`
            create table "historyTransfer" (
                  id serial not null,
                  "dateTransfer" date not null,
                  "userID" integer not null,
                  amount real not null,
                  foreign key ("userID") references "Users" (id),
                  primary key (id)
            )
      `)
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
    await createPaymentAccount();
    await createHistoryTransfer();
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

module.exports = {
    connectDB,
    db,
};

/**
 

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

(1,'2022-12-12', 1, 123.3, 'yes', 'ck'),
(2, '2023-10-12', 1, 123.3, 'yes', 'ck'),
(3, '2022-4-12', 7, 123.3, 'yes', 'ck'),
(4, '2023-12-12', 5, 123.3, 'yes', 'ck'),
(5,'2022-3-12', 8, 123.3, 'yes', 'ck'),
(6,'2023-7-12', 6, 123.3, 'yes', 'ck'),
(7,'2023-12-12', 1, 123.3, 'yes', 'ck'),
(8,'2023-1-12', 1, 123.3, 'yes', 'ck'),
(9.'2023-3-12', 1, 123.3, 'yes', 'ck'),
(10,'2023-2-12', 2, 123.3, 'yes', 'ck'),
(11,'2022-4-12', 2, 123.3, 'yes', 'ck'),
(12,'2023-1-12', 2, 123.3, 'yes', 'ck'),
(13,'2022-3-12', 1, 123.3, 'yes', 'ck'),
(14,'2023-2-12', 2, 123.3, 'yes', 'ck'),
(15,'2022-12-12', 2, 123.3, 'yes', 'ck'),
(16,'2022-12-12', 2, 123.3, 'yes', 'ck'),
(17,'2023-12-12', 8, 123.3, 'yes', 'ck'),
(18,'2023-5-12', 3, 123.3, 'yes', 'ck'),
(19,'2023-8-12', 9, 123.3, 'yes', 'ck'),
(20,'2023-12-12', 9, 123.3, 'yes', 'ck'),
(21,'2023-12-12', 9, 123.3, 'yes', 'ck'),
(22,'2023-3-12', 7, 123.3, 'yes', 'ck'),
(23,'2022-12-12', 3, 123.3, 'yes', 'ck'),
(24,'2023-4-12', 3, 123.3, 'yes', 'ck'),
(25,'2022-1-12', 4, 123.3, 'yes', 'ck'),
(26,'2023-1-12', 10, 123.3, 'yes', 'ck'),
(27,'2022-12-12',5, 123.3, 'yes', 'ck'),
(28,'2023-1-12', 9, 123.3, 'yes', 'ck'),
(29,'2023-4-12', 4, 123.3, 'yes', 'ck'),
(30,'2023-5-12', 4, 123.3, 'yes', 'ck'),
(31,'2023-5-12', 4, 123.3, 'yes', 'ck'),
(32,'2022-1-12', 5, 123.3, 'yes', 'ck'),
(33,'2022-5-12', 5, 123.3, 'yes', 'ck'),
(34,'2022-2-12', 5, 123.3, 'yes', 'ck'),
(35,'2023-5-12', 5, 123.3, 'yes', 'ck'),
(36,'2023-1-12', 10, 123.3, 'yes', 'ck'),
(37,'2023-9-12', 9, 123.3, 'yes', 'ck'),
(38,'2023-8-12', 1, 123.3, 'yes', 'ck'),
(39,'2023-5-12', 5, 123.3, 'yes', 'ck'),
(40,'2022-3-12', 6, 123.3, 'yes', 'ck'),
(41,'2023-5-12', 9, 123.3, 'yes', 'ck'),
(42,'2023-5-12', 1, 123.3, 'yes', 'ck'),
(43,'2023-5-12', 2, 123.3, 'yes', 'ck'),
(44,'2023-5-12', 3, 123.3, 'yes', 'ck'),
(45,'2023-5-12', 4, 123.3, 'yes', 'ck'),
(46,'2023-5-12', 9, 123.3, 'yes', 'ck'),
(47,'2022-5-12', 6, 123.3, 'yes', 'ck'),
(48,'2023-5-12', 9, 123.3, 'yes', 'ck'),
(49,'2022-5-12', 10, 123.3, 'yes', 'ck'),
(50,'2023-5-12', 6, 123.3, 'yes', 'ck')

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
