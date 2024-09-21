const kecamatanController = require('../../controllers/master/kecamatan.controller');

const mid = require('../../middlewares/auth.middleware');

const express = require('express');
const route = express.Router();

route.post('/kecamatan/create', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin'])], kecamatanController.create);
route.get('/kecamatan/get', kecamatanController.get); 
route.get('/kecamatan/get/:id', kecamatanController.getById); 
route.put('/kecamatan/update/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin'])], kecamatanController.update); 
route.delete('/kecamatan/delete/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin'])], kecamatanController.delete);

module.exports = route;