const express = require("express");
const adminController = require("../controllers/adminController");
const loadController = require("../controllers/loadController");
const userController = require("../controllers/userController");
const mainRoutes = express.Router();



mainRoutes.post("/login", adminController.adminLogin);
mainRoutes.post("/admin/addEmployee", adminController.addEmployee);


mainRoutes.post("/addloads", loadController.createLoad);
mainRoutes.get("/getloads", loadController.getLoads);
mainRoutes.get('/getLoadDetailsById/:id', loadController.getLoadDetailsById);
mainRoutes.get('/getBarcodeImage/:id', loadController.getBarcodeImageById);

mainRoutes.get('/getLoadDetailsBySkuCode/:skuCode', loadController.getLoadDetailsBySkuCode);
mainRoutes.get('/getBrandDetailsBySkuCode/:skuCode', loadController.getBrandDetailsBySkuCode);

mainRoutes.patch('/updateRemainingPalletsCount/:id', loadController.updateRemainingPalletsCount);
mainRoutes.post('/updateUsedLoad', loadController.updateUsedLoads);

mainRoutes.get("/fetchPurschaseOrder",loadController.fetchUsedLoadsInfo)
mainRoutes.get("/recentLoad",loadController.recentLoadFetch)
mainRoutes.get('/totalLoads', loadController.getTotalLoadsCount);
mainRoutes.get("/totalPallets",loadController.getTotalPallets)
mainRoutes.get("/totalRemainingPallets",loadController.getRemainingPallets);
mainRoutes.get("/totalLoadCost",loadController.getTotalLoadsCost);
mainRoutes.get("/getNotifications",loadController.getLoadsLessThanOrEqualTo5)

mainRoutes.get('/employeeAdmins', userController.fetchEmployeeAdmins);
mainRoutes.patch('/editEmployee/:id', userController.editEmployee);
mainRoutes.delete('/deleteEmployee/:id', userController.deleteEmployee);
mainRoutes.get("/fetchAdminAndEmployee",userController.fetchAdminAndEmployeeCounts)

module.exports = mainRoutes;
