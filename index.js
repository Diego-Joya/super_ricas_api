const express = require("express");
require("dotenv").config();
const routerApi = require("./routes");
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require("./middlewares/error_handler");

const cors = require("cors");
const { checkApiKey } = require("./middlewares/auth_handler");
const http = require("http");
const https = require("https");

const app = express();
app.use(cors());
require("./utils/auth");

// app.get('/nueva-ruta', checkApiKey,(req, res)=>{
app.get("/nueva-ruta", checkApiKey, (req, res) => {
  res.send("holaaa nene");
});

app.use(express.static("public"));

app.use(express.json());

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

console.log(process.env.PORT);

// https.createServer(app).listen(process.env.PORT, process.env.HOST);
// http.createServer(app).listen(process.env.PORT, process.env.HOST);

app.listen(() => {
  console.log(`Sevidor corriendo ${process.env.PORT}`);
});
