
const db = require("../../utils/db.js")

module.exports = class  PaymentModel {

      static getAllPayByDurationTime = async (obj) => {
            return await db.db.query(`
                  select id, "orderId", "userId", "paymentDate", amount
                  from "Payments"
                  where "paymentDate" between $1 and $2
                  order by "orderId"
            `, [obj.start, obj.end])
      }

      static getAllPayByYear = async (obj) => {
            return await db.db.query(`
                  select id, "orderId", "userId", "paymentDate", amount
                  from "Payments"
                  where extract(year from "paymentDate") = $1
                  order by "orderId"
            `, [parseInt(obj.year)])
      }

      static getAllPayByMonth = async (obj) => {
            return await db.db.query(`
                  select id, "orderId", "userId", "paymentDate", amount
                  from "Payments"
                  where extract(year from "paymentDate") = $1 and extract (month from "paymentDate") = $2
                  order by "orderId"
            `, [parseInt(obj.year), parseInt(obj.month)])
      }

      static getAllPayByDay = async (obj) => {
            let str = obj.year + "-" + obj.month + "-" + obj.day;
            console.log(str);
            return await db.db.query(`
                  select id, "orderId", "userId", "paymentDate", amount
                  from "Payments"
                  where "paymentDate" = $1 and status = 'yes'
                  order by "orderId"
            `, [str])
      }

      static getRevenueByDurationTime = async (obj) => {
            return await db.db.query(`
                  select sum(amount) as revenue
                  from "Payments"
                  where "paymentDate" between $1 and $2
            `, [obj.start, obj.end])
      }

      static getRevenueByYear = async (obj) => {
            return await db.db.query(`
                  select  sum(amount) as revenue
                  from "Payments"
                  where EXTRACT(YEAR FROM "paymentDate") = $1
            `,[parseInt(obj.year)])
      }

      static getRevenueByMonth = async(obj) => {
            return await db.db.query(`
                  select sum(amount) as revenue
                  from "Payments"
                  where EXTRACT(year FROM "paymentDate") = $1 and EXTRACT(month FROM "paymentDate") = $2
            `,[parseInt(obj.year), parseInt(obj.month)])
      }

      static getRevenueByDay = async (obj) => {
            let str = obj.year + "-" + obj.month + "-" + obj.day;
            return await db.db.query(`
                  select  sum(amount) as revenue
                  from "Payments"
                  where "paymentDate" = $1
            `, [str])
      }

      static getExpectedRevenue = async () => {
            return await db.db.one(`   
                  select sum(amount) as revenue
                  from "Payments"
            `)
      }

      static getExpectedRevenueToday = async () => {
            const currDate = new Date().toJSON().slice(0, 10);
            // const currDate = "2023-05-12"
            return await db.db.query(`
                  select "paymentDate", sum(amount) as revenue
                  from "Payments"
                  where "paymentDate" = $1
                  group by "paymentDate"
            `,[currDate])
      }

      static getRevenueToday = async () => {
            const currDate = new Date().toJSON().slice(0, 10);
            // const currDate = "2023-05-12"
            return await db.db.query(`
                  select "paymentDate", sum(amount) as revenue
                  from "Payments"
                  where status = 'yes' and "paymentDate" = $1
                  group by "paymentDate"
            `,[currDate])
      }

      static getAllRevenue = async () => {
            return await db.db.one(`   
                  select sum(amount) as revenue
                  from "Payments"
                  where status = 'yes'
            `)
      }
}