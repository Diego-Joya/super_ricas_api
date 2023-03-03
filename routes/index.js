
const usuario = require('./user');
const productos = require('./products');
const category = require('./category');
const zones = require('./zones');
const inv_zones = require('./inv_zones');
const profiles = require('./profiles');
const login = require('./login');
const invetario_detalle = require('./invetario_detalle');
const payments = require('./payments');
const returns = require('./returns');
const sales = require('./zones_sales');
const balance = require('./balances');




function routerApi(app) {
  app.use("/api/users", usuario);
  app.use("/api/products", productos); 
  app.use("/api/category", category); 
  app.use("/api/zones", zones); 
  app.use("/api/inv_zones", inv_zones); 
  app.use("/api/profiles", profiles); 
  app.use("/api/login", login); 
  app.use("/api/inventario_det", invetario_detalle); 
  app.use("/api/payments", payments); 
  app.use("/api/returns", returns); 
  app.use("/api/sale", sales); 
  app.use("/api/balances", balance); 


}


module.exports = routerApi;
