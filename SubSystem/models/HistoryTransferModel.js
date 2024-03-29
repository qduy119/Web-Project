

const db = require("../../utils/db.js")

module.exports = class HistoryTransferModel {

    static getListTransaction = async (id) => {
        return await db.db.query(`
                select * from "historyTransfer"
                where "creditId" in (select id from "paymentAccount" where "userId" = $1)
            `, [id])
    }

    static getDetailTransaction = async (id) => {
        return await db.db.one(`
                  select *
                  from "historyTransfer" as ht
                  where id = $1 
            `, [id])
    }

    static getAllPayByDurationTime = async (obj) => {
        return await db.db.query(`
                  select * 
                  from "historyTransfer" ht, "paymentAccount" pa
                  where ("dateTransfer" between $1 and $2) and ht."creditId" = pa.id
                  order by ht."orderId"
            `, [obj.start, obj.end])
    }

    static getAllPayByYear = async (obj) => {
        return await db.db.query(`
                  select *
                  from "historyTransfer" ht, "paymentAccount" pa
                  where extract(year from "dateTransfer") = $1 and ht."creditId" = pa.id
                  order by ht."orderId"
            `, [parseInt(obj.year)])
    }

    static getAllPayByMonth = async (obj) => {
        return await db.db.query(`
                  select *
                  from "historyTransfer" ht, "paymentAccount" pa
                  where pa.id = ht."creditId" extract(year from "dateTransfer") = $1 and extract (month from "dateTransfer") = $2
                  order by ht."orderId"
            `, [parseInt(obj.year), parseInt(obj.month)])
    }

    static getAllPayByDay = async (obj) => {
        let str = obj.year + "-" + obj.month + "-" + obj.day;
        return await db.db.query(`
                  select *
                  from "historyTransfer" ht, "paymentAccount" pa
                  where "dateTransfer" = $1 and pa.id = ht."creditId"
                  order by ht."orderId"
            `, [str])
    }

    static getRevenueByDurationTime = async (obj) => {
        return await db.db.query(`
                  select sum(amount) as revenue
                  from "historyTransfer"
                  where "dateTransfer" between $1 and $2
            `, [obj.start, obj.end])
    }

    static getRevenueByYear = async (obj) => {
        return await db.db.query(`
                  select sum(amount) as revenue
                  from "historyTransfer"
                  where extract(year from "dateTransfer") = $1
            `, [obj.year])
    }

    static getRevenueByMonth = async (obj) => {
        return await db.db.query(`
                  select  sum(amount) as revenue
                  from "historyTransfer"
                  where extract(year from "dateTransfer") = $1 and extract (month from "dateTransfer") = $2
            `, [parseInt(obj.year), parseInt(obj.month)])
    }

    static getRevenueByDay = async (obj) => {
        let str = obj.year + "-" + obj.month + "-" + obj.day;
        return await db.db.query(`
                  select sum(amount) as revenue
                  from "historyTransfer"
                  where "dateTransfer" = $1
            `, [str])
    }

    static getRevenueToday = async () => {
        const currDate = new Date().toJSON().slice(0, 10);
        return await db.db.query(`
                  select "dateTransfer", sum(amount) as revenue
                  from "historyTransfer"
                  where "dateTransfer" = $1
                  group by "dateTransfer"
            `, [currDate])
    }

    static getAllRevenue = async () => {
        return await db.db.one(`   
                  select sum(amount) as revenue
                  from "historyTransfer"
            `)
    }
}