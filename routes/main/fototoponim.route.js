//kode dari file fototoponim.route.js

//import controller user.controller.js 
const fototoponimController = require('../../controllers/main/fototoponim.controller');

//import middleware dari auth.middleware.js
const mid = require('../../middlewares/auth.middleware');

//express
const express = require('express');
const route = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.get('/fototoponim/get/:datatoponim_id', fototoponimController.getfototoponim);

route.post('/fototoponim/upload-foto/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], upload.fields([{ name: 'foto', maxCount: 1 }]), fototoponimController.createFototoponim);

route.put('/fototoponim/update-sketsa/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], upload.fields([{ name: 'sketsa', maxCount: 1 }]), fototoponimController.updateSketsa);
route.put('/fototoponim/update-docs/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], upload.fields([{ name: 'docpendukung', maxCount: 1 }]), fototoponimController.updateDocpendukung);
route.put('/fototoponim/update-foto/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], upload.fields([{ name: 'foto', maxCount: 1 }]), fototoponimController.updateFototoponim);

route.delete('/fototoponim/delete-sketsa/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], fototoponimController.deleteSketsa);
route.delete('/fototoponim/delete-docs/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], fototoponimController.deleteDocPendukung);
route.delete('/fototoponim/delete-foto/:id', [mid.checkRolesAndLogout(['Super Admin', 'Verifikator', 'Surveyor', 'User'])], fototoponimController.deleteFotoToponim);


module.exports = route;