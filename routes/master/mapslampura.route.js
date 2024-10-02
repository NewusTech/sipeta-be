const mapslampuraController = require('../../controllers/master/mapslampura.controller');

const mid = require('../../middlewares/auth.middleware');

const express = require('express');
const route = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
 
route.get('/mapslampura/get', mapslampuraController.getmapslampura); 
route.put('/mapslampura/update', [mid.checkRolesAndLogout(['Super Admin'])], upload.single('file'), mapslampuraController.updatemapslampura);

module.exports = route;