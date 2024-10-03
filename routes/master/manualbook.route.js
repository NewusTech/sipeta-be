const manualbookController = require('../../controllers/master/manualbook.controller');

const mid = require('../../middlewares/auth.middleware');

const express = require('express');
const route = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
 
route.get('/manualbook/get', manualbookController.getmanualbook);
route.get('/manualbook/get/:id', manualbookController.getmanualbookbyid); 
route.put('/manualbook/update/:id', [mid.checkRolesAndLogout(['Super Admin'])], upload.fields([{ name: 'manualbook', maxCount: 1 }]), manualbookController.updatemanualbook);

module.exports = route;