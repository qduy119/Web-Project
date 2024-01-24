

const HistoryTransferModel = require("../models/HistoryTransferModel.js")
const PaymentModel = require("../models/PaymentModel.js");

module.exports = class HistoryTransferController {

    static handleDetailTransaction = async (req, res) => {
        const id = req.query.id;
        const data = await HistoryTransferModel.getDetailTransaction(id);
        res.json(data);
    }

    static handlePostDetailControllerRevenue = async (req, res) => {
        const obj = req.body;
        let res1, res2;
        if (obj.criteria === "day") {
            res1 = await HistoryTransferModel.getAllPayByDay(obj);
            res2 = await PaymentModel.getAllPayByDay(obj);
        }
        else if (obj.criteria === "month") {
            res1 = await HistoryTransferModel.getAllPayByMonth(obj);
            res2 = await PaymentModel.getAllPayByMonth(obj);
        }
        else if (obj.criteria === "year") {
            res1 = await HistoryTransferModel.getAllPayByYear(obj);
            res2 = await PaymentModel.getAllPayByYear(obj);
        }
        else {
            res1 = await HistoryTransferModel.getAllPayByDurationTime(obj);
            res2 = await PaymentModel.getAllPayByDurationTime(obj);
        }
        let index = -1;
        for (let i = 0; i < res1.length; i++) {
            const item1 = res1[i];
            const item2 = res2[i];
            if (item1.userID !== item2.userId) {
                console.log("user id");
                index = i;
                break;
            }
            else if (String(item1.dateTransfer).substring(0, 11) !== String(item2.paymentDate).substring(0, 11)) {
                console.log("date");
                index = i;
                break;
            }
            else if (item1.amount !== item2.amount) {
                console.log("amount");
                index = i;
                break;
            }
        }
        res.json({ subSystem: res1, mainSystem: res2, index: index });
    }

    static handlePostControlTotalRevenue = async (req, res) => {
        console.log(req.body);
        const obj = req.body;
        if (obj.criteria === "day") {
            let res1 = await HistoryTransferModel.getRevenueByDay(obj);
            let res2 = await PaymentModel.getRevenueByDay(obj);
            res.json({ subSystem: res1, mainSystem: res2 });
        }
        else if (obj.criteria === "month") {
            let res1 = await HistoryTransferModel.getRevenueByMonth(obj);
            let res2 = await PaymentModel.getRevenueByMonth(obj);
            res.json({ subSystem: res1, mainSystem: res2 });
        }
        else if (obj.criteria === "year") {
            let res1 = await HistoryTransferModel.getRevenueByYear(obj);
            let res2 = await PaymentModel.getRevenueByYear(obj);
            res.json({ subSystem: res1, mainSystem: res2 });
        }
        else {
            let res1 = await HistoryTransferModel.getRevenueByDurationTime(obj);
            let res2 = await PaymentModel.getRevenueByDurationTime(obj);
            res.json({ subSystem: res1, mainSystem: res2 });
        }
    }

    static handleDetailControlRevenue = async (req, res) => {
        res.render("detailControlRevenue");
    }

    static handleControlTotalRevenue = async (req, res) => {
        res.render("controlTotalRevenue")
    }

    static handleGetTotalRevenueToday = async (req, res) => {
        let data = await HistoryTransferModel.getRevenueToday();
        res.json(data);
    }

    static handleGetAllRevenue = async (req, res) => {
        let data = await HistoryTransferModel.getAllRevenue();
        res.json(data);
    }
}