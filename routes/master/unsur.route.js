//kode dari file unsur.route.js

//import controller user.controller.js 
const unsurController = require('../../controllers/master/unsur.controller');

//import middleware dari auth.middleware.js
const mid = require('../../middlewares/auth.middleware');

//express
const express = require('express');
const route = express.Router();

route.post('/unsur/create', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'User'])], unsurController.input);
route.get('/unsur/get', unsurController.get); 
route.get('/unsur/get/:id', unsurController.getbyid); 
route.put('/unsur/update/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'User'])], unsurController.update); 
route.delete('/unsur/delete/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'User'])], unsurController.delete);

module.exports = route;