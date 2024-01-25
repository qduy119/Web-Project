

const UserController = require("../controllers/UserController.js")
const PaymentController = require("../controllers/PaymentController.js")
const HistoryTransferController = require("../controllers/HistoryTransferController.js")
const CreatePaymentAccount = require("../controllers/CreateAccountPayment.js")
const authenSystem = require("../authen/AuthenSystem")
const authenAccount = require("../authen/AuthenAccount")
const route = (app) => {

      app.get("/logout", UserController.handleLogout)

      app.get("/get-transaction-user", HistoryTransferController.getTransactionUser)

      app.get("/history-transaction",authenAccount, (req, res) => {
            res.render("listUser")
      })

      // app.get("/history-transfer")

      app.post("/transfer-to-payment", PaymentController.Payment)

      app.post("/create-account-payment", CreatePaymentAccount.CreateAccount)

      app.post("/detail-transaction",authenAccount, HistoryTransferController.handlePostDetailTransaction)

      app.get("/detail-transaction",authenAccount, HistoryTransferController.handleDetailTransaction)

      app.get("/detail-control-revenue",authenAccount, HistoryTransferController.handleDetailControlRevenue)

      app.post("/detail-control-revenue",authenAccount, HistoryTransferController.handlePostDetailControllerRevenue)

      app.get("/control-total-revenue",authenAccount, HistoryTransferController.handleControlTotalRevenue)

      app.post("/control-total-revenue",authenAccount, HistoryTransferController.handlePostControlTotalRevenue)

      app.get("/get-all-revenue", HistoryTransferController.handleGetAllRevenue)

      app.get("/get-today-revenue", HistoryTransferController.handleGetTotalRevenueToday);

      app.post("/login-admin", UserController.handleLoginAdmin)

      app.get("/detail-user",authenAccount, UserController.handleDetailUser) 

      app.get("/get-all-user",authenAccount, UserController.handdleGetAllUser)

      app.get("/get-10-user", authenAccount, UserController.handleGet10User);

      app.get("/", (req, res) => {
            res.render("content");
      })
}

module.exports = route;