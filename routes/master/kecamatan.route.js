const kecamatanController = require('../../controllers/master/kecamatan.controller');

const mid = require('../../middlewares/auth.middleware');

const express = require('express');
const route = express.Router();

route.get('/kecamatan/get', kecamatanController.getkecamatan); 
route.get('/kecamatan/get/:id', kecamatanController.getkecamatanById); 

module.exports = route;