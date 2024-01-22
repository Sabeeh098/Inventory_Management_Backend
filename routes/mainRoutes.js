const express = require("express");
const adminController = require("../controllers/adminController");
const loadController = require("../controllers/loadController");
const palletController = require("../controllers/palletController");
const mainRoutes = express.Router();

mainRoutes.post("/login", adminController.adminLogin);
mainRoutes.post("/addloads", loadController.createLoad);
mainRoutes.get("/getloads", loadController.getLoads);
mainRoutes.post("/createPallete", palletController.createPallet);
mainRoutes.get("/getPalletes", palletController.showPallets);
mainRoutes.get("/print/:palletId", palletController.printBarcode);
mainRoutes.get('/getLoadDetailsById/:id', loadController.getLoadDetailsById);
mainRoutes.get('/getBarcodeImage/:id', loadController.getBarcodeImageById);

// Add a new route for fetching load details by SKU code
mainRoutes.get('/getLoadDetailsBySkuCode/:skuCode', loadController.getLoadDetailsBySkuCode);

module.exports = mainRoutes;