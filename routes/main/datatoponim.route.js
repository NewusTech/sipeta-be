//kode dari file datatoponim.route.js

//import controller user.controller.js 
const datatoponimController = require('../../controllers/main/datatoponim.controller');

//import middleware dari auth.middleware.js
const mid = require('../../middlewares/auth.middleware');

//express
const express = require('express');
const route = express.Router();

route.get('/datatoponim/get', [mid.checkRoles()], datatoponimController.get);
route.get('/datatoponim/get/:id', [mid.checkRoles()], datatoponimController.getById);

route.post('/datatoponim/create', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'Surveyor', 'User'])], datatoponimController.create);

route.put('/datatoponim/update/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'Surveyor', 'User'])], datatoponimController.update);
route.put('/datatoponim/verif/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'Surveyor', 'User'])], datatoponimController.update);

route.delete('/datatoponim/delete/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'Surveyor', 'User'])], datatoponimController.delete);

route.get('/datatoponim/pdf', [mid.checkRoles()], datatoponimController.pdf);
route.get('/datatoponim/excel', [mid.checkRoles()], datatoponimController.excel);
route.get('/datatoponim/csv', [mid.checkRoles()], datatoponimController.csv);
route.get('/datatoponim/json', [mid.checkRoles()], datatoponimController.json);
route.get('/datatoponim/shp', [mid.checkRoles()], datatoponimController.shp);

module.exports = route;