const klasifikasiController = require('../../controllers/master/klasifikasi.controller');

const mid = require('../../middlewares/auth.middleware');

const express = require('express');
const route = express.Router();

route.post('/klasifikasi/create', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin'])], klasifikasiController.create);
route.get('/klasifikasi/get', klasifikasiController.get); 
route.get('/klasifikasi/get/:id', klasifikasiController.getById); 
route.put('/klasifikasi/update/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin'])], klasifikasiController.update); 
route.delete('/klasifikasi/delete/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin'])], klasifikasiController.delete);

module.exports = route;