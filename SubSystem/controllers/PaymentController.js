

const PaymentModel = require("../models/PaymentModel.js")

module.exports = class PaymentController {

      static handleGetExpectedRevenueToday = async (req, res) => {
            let data = await PaymentModel.getExpectedRevenueToday();
            res.json(data);
      }

      static handleGetExpectedRevenue = async (req, res) => {
            let data = await PaymentModel.getExpectedRevenue();
            res.json(data);
      }

      static handleGetTotalRevenueToday = async (req, res) => {
            let data = await PaymentModel.getRevenueToday();
            res.json(data);
      }
      
      static handleGetAllRevenue = async (req,res) => {
            let data = await PaymentModel.getAllRevenue();
            res.json(data);
      }
}