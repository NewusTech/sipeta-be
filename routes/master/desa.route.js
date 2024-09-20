const desaController = require('../../controllers/master/desa.controller');

const mid = require('../../middlewares/auth.middleware');

const express = require('express');
const route = express.Router();

route.get('/desa/get', desaController.getdesa); 
route.get('/desa/get/:id', desaController.getdesaById); 

module.exports = route;