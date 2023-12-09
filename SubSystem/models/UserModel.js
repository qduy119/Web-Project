

const db = require("../../utils/db.js")

module.exports = class UserModel {

      static getAccountAdmin = async (username) => {
            return await db.query(`
                  select * 
                  from "Users"
                  where username = $1
            `, [username])
      }

      static getUserByID = async (id) => {
            return db.one(`
                  select id, email, role, username, avatar, gender, dob, avatar
                  from "Users"
                  where id = $1
            `, [id])
      }

      static get10User = async () => {
            return await db.query(`
                  select id, email, role, username, avatar, gender, dob
                  from "Users"
                  where role = 'user'
                  limit 10
            `)
      }
      static getAllUser = async () => {
            return await db.query(`
                  select id, email, role, username, avatar, gender, dob
                  from "Users"
                  where role = 'user'
            `)
      }
}