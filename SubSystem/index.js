require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.SUB_PORT || 8080;

app.listen(PORT, () => {
    console.log(`Sub server listening on ${PORT}`);
});
