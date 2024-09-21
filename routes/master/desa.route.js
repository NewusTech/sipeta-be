const desaController = require('../../controllers/master/desa.controller');

const mid = require('../../middlewares/auth.middleware');

const express = require('express');
const route = express.Router();

route.post('/desa/create', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin'])], desaController.create);
route.get('/desa/get', desaController.get); 
route.get('/desa/get/:id', desaController.getById); 
route.put('/desa/update/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin'])], desaController.update); 
route.delete('/desa/delete/:id', [mid.checkRolesAndLogout(['Super Admin', 'Kabag', 'Verifikasi', 'Admin'])], desaController.delete);

module.exports = route;