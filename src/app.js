const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

app.get("/health", (req, res) => res.send("OK"));

app.use("/api/accounts", require("./routes/accounts"));
app.use("/api/projections", require("./routes/projections"));

app.listen(process.env.API_PORT, () =>
  console.log("Server started")
);