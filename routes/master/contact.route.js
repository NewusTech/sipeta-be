const contactController = require('../../controllers/master/contact.controller');

const mid = require('../../middlewares/auth.middleware');

const express = require('express');
const route = express.Router();
 
route.get('/contact/get', contactController.getcontact); 
route.put('/contact/update', [mid.checkRolesAndLogout(['Super Admin'])], contactController.updatecontact); 

module.exports = route;