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

mainRoutes.get('/getLoadDetailsBySkuCode/:skuCode', loadController.getLoadDetailsBySkuCode);
mainRoutes.get('/getBrandDetailsBySkuCode/:skuCode', loadController.getBrandDetailsBySkuCode);

mainRoutes.patch('/updateRemainingPalletsCount/:id', loadController.updateRemainingPalletsCount);
mainRoutes.post('/updateUsedLoad', loadController.updateUsedLoads);

module.exports = mainRoutes;
