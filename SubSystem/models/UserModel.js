

const db = require("../../utils/db.js")

module.exports = class UserModel {

      static getAccountAdmin = async (username) => {
            return await db.db.query(`
                  select * 
                  from "Users"
                  where username = $1
            `, [username])
      }

      static getUserByID = async (id) => {
            return db.db.one(`
                  select *
                  from "Users"
                  where id = $1
            `, [id])
      }

      static get10User = async () => {
            return await db.db.query(`
                  select *
                  from "Users"
                  where role = 'customer'
                  limit 10
            `)
      }
      static getAllUser = async () => {
            return await db.db.query(`
                  select *
                  from "Users"
                  where role = 'customer'
            `)
      }
}