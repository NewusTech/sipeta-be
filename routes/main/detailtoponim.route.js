//kode dari file detailtoponim.route.js

//import controller user.controller.js 
const detailtoponimController = require('../../controllers/main/detailtoponim.controller');

//import middleware dari auth.middleware.js
const mid = require('../../middlewares/auth.middleware');

//express
const express = require('express');
const route = express.Router();

route.post('/detailtoponim/input', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], detailtoponimController.createOrUpdate);
route.get('/detailtoponim/get/:datatoponim_id', detailtoponimController.get);
route.delete('/detailtoponim/delete/:datatoponim_id', detailtoponimController.delete);

module.exports = route;