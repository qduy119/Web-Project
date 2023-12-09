

const UserController = require("../controllers/UserController.js")
const PaymentController = require("../controllers/PaymentController.js")
const HistoryTransferController = require("../controllers/HistoryTransferController.js")
const route = (app) => {

      app.get("/detail-transaction-subsystem", HistoryTransferController.handleDetailTransaction)

      app.get("/detail-control-revenue", HistoryTransferController.handleDetailControlRevenue)

      app.post("/detail-control-revenue", HistoryTransferController.handlePostDetailControllerRevenue)

      app.get("/control-total-revenue", HistoryTransferController.handleControlTotalRevenue)

      app.post("/control-total-revenue", HistoryTransferController.handlePostControlTotalRevenue)

      app.get("/get-total-expected-revenue", PaymentController.handleGetExpectedRevenue)

      app.get("/get-expected-revenue-today", PaymentController.handleGetExpectedRevenueToday)

      app.get("/get-all-revenue", HistoryTransferController.handleGetAllRevenue)

      app.get("/get-today-revenue", HistoryTransferController.handleGetTotalRevenueToday);

      app.post("/login-admin", UserController.handleLoginAdmin)

      app.get("/detail-user", UserController.handleDetailUser) 

      app.get("/get-all-user", UserController.handdleGetAllUser)

      app.get("/get-10-user", UserController.handleGet10User);

      app.get("/", (req, res) => {
            res.render("content");
      })
}

module.exports = route;