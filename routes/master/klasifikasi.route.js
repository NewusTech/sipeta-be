//kode dari file klasifikasi.route.js

//import controller user.controller.js 
const klasifikasiController = require('../../controllers/master/klasifikasi.controller');

//import middleware dari auth.middleware.js
const mid = require('../../middlewares/auth.middleware');

//express
const express = require('express');
const route = express.Router();

route.post('/klasifikasi/create', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'User'])], klasifikasiController.createklasifikasi);
route.get('/klasifikasi/get', klasifikasiController.getklasifikasi); 
route.get('/klasifikasi/get/:id', klasifikasiController.getklasifikasiById); 
route.put('/klasifikasi/update/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'User'])], klasifikasiController.updateklasifikasi); 
route.delete('/klasifikasi/delete/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin', 'User'])], klasifikasiController.deleteklasifikasi);

module.exports = route;