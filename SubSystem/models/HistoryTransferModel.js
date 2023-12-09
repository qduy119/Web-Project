

const db = require("../../utils/db.js")

module.exports = class HistoryTransferModel {

      static getDetailTransaction = async (id) => {
            return await db.one(`
                  select *
                  from "historyTransfer" as ht, "Orders" as o, "Users" as u, "OrderDetails" as od, "Products" as p
                  where ht."orderId" = $1 and o.id = $1 and ht."userID" = u.id and od."orderId" = $1 and od."productId" = p.id
            `, [id])
      }

      static getAllPayByDurationTime = async (obj) => {
            return await db.query(`
                  select * 
                  from "historyTransfer"
                  where "dateTransfer" between $1 and $2
                  order by "orderId"
            `, [obj.start, obj.end])
      }

      static getAllPayByYear = async (obj) => {
            return await db.query(`
                  select *
                  from "historyTransfer"
                  where extract(year from "dateTransfer") = $1
                  order by "orderId"
            `, [parseInt(obj.year)])
      }

      static getAllPayByMonth = async (obj) => {
            return await db.query(`
                  select *
                  from "historyTransfer"
                  where extract(year from "dateTransfer") = $1 and extract (month from "dateTransfer") = $2
                  order by "orderId"
            `, [parseInt(obj.year), parseInt(obj.month)])
      }

      static getAllPayByDay = async (obj) => {
            let str = obj.year + "-" + obj.month + "-" + obj.day;
            return await db.query(`
                  select *
                  from "historyTransfer"
                  where "dateTransfer" = $1
                  order by "orderId"
            `, [str])
      }

      static getRevenueByDurationTime = async (obj) => {
            return await db.query(`
                  select sum(amount) as revenue
                  from "historyTransfer"
                  where "dateTransfer" between $1 and $2
            `, [obj.start, obj.end])
      }

      static getRevenueByYear = async (obj) => {
            return await db.query(`
                  select sum(amount) as revenue
                  from "historyTransfer"
                  where extract(year from "dateTransfer") = $1
            `,[obj.year])
      }

      static getRevenueByMonth = async(obj) => {
            return await db.query(`
                  select  sum(amount) as revenue
                  from "historyTransfer"
                  where extract(year from "dateTransfer") = $1 and extract (month from "dateTransfer") = $2
            `,[parseInt(obj.year), parseInt(obj.month)])
      }

      static getRevenueByDay = async (obj) => {
            let str = obj.year + "-" + obj.month + "-" + obj.day;
            return await db.query(`
                  select sum(amount) as revenue
                  from "historyTransfer"
                  where "dateTransfer" = $1
            `, [str])
      }

      static getRevenueToday = async () => {
            const currDate = new Date().toJSON().slice(0, 10);
            return await db.query(`
                  select "dateTransfer", sum(amount) as revenue
                  from "historyTransfer"
                  where "dateTransfer" = $1
                  group by "dateTransfer"
            `,[currDate])
      }

      static getAllRevenue = async () => {
            return await db.one(`   
                  select sum(amount) as revenue
                  from "historyTransfer"
            `)
      } 
}