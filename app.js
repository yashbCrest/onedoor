const express = require("express");
const route = require("./route");
const app = express();
require("dotenv").config();
const port = process.env.port;
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use(route);
app.listen(port, () => {
  console.log(`connection is setup at ${port}`);
});
