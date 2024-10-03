const datatoponimController = require('../../controllers/main/datatoponim.controller');
const importtoponimController = require('../../controllers/main/importtoponim.controller');

const mid = require('../../middlewares/auth.middleware');

//express
const express = require('express');
const route = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.get('/datatoponim/get', [mid.checkRoles()], datatoponimController.get);
route.get('/datatoponim/get/:id', [mid.checkRoles()], datatoponimController.getById);

route.post('/datatoponim/create', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], datatoponimController.create);

route.put('/datatoponim/update/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], datatoponimController.update);
route.put('/datatoponim/verif/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], datatoponimController.update);

route.delete('/datatoponim/delete/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], datatoponimController.delete);

route.get('/datatoponim/pdf', [mid.checkRoles()], datatoponimController.pdf);
route.get('/datatoponim/excel', [mid.checkRoles()], datatoponimController.excel);
route.get('/datatoponim/csv', [mid.checkRoles()], datatoponimController.csv);
route.get('/datatoponim/json', [mid.checkRoles()], datatoponimController.json);
route.get('/datatoponim/shp', [mid.checkRoles()], datatoponimController.shp);

route.post('/datatoponim/import-json', [mid.checkRoles()], upload.single('file'), importtoponimController.importJson);
route.post('/datatoponim/import-excel', [mid.checkRoles()], upload.single('file'), importtoponimController.importExcel);
route.post('/datatoponim/import-csv', [mid.checkRoles()], upload.single('file'), importtoponimController.importCsv);
route.post('/datatoponim/import-shp', [mid.checkRoles()], upload.single('file'), importtoponimController.importShp);

module.exports = route;