const { response } = require('../../helpers/response.formatter');

const { Contact } = require('../../models');
const Validator = require("fastest-validator");
const v = new Validator();
const logger = require('../../errorHandler/logger');

module.exports = {

    getcontact: async (req, res) => {
        try {
            let contactGet = await Contact.findOne();

            if (!contactGet) {
                res.status(404).json(response(404, 'contact not found'));
                return;
            }

            //response menggunakan helper response.formatter
            res.status(200).json(response(200, 'success get contact by id', contactGet));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    //mengupdate contact berdasarkan id
    updatecontact: async (req, res) => {
        try {
            let contactGet = await Contact.findOne()

            if (!contactGet) {
                res.status(404).json(response(404, 'contact not found'));
                return;
            }

            const schema = {
                alamat: { type: "string", min: 3, optional: true },
                email: { type: "string", min: 5, max: 50, pattern: /^\S+@\S+\.\S+$/, optional: true },
                telp: { type: "string", min: 7, max: 15, optional: true },
                latitude: { type: "string", min: 3, optional: true },
                longitude: { type: "string", min: 3, optional: true },
            }

            let contactUpdateObj = {
                website: req.body.website,
                desc: req.body.desc,
                alamat: req.body.alamat,
                telp: req.body.telp,
                email: req.body.email,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
            }

            const validate = v.validate(contactUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            await Contact.update(contactUpdateObj, {
                where: {
                  id: contactGet.id,
                },
              });

            let contactAfterUpdate = await Contact.findOne()

            res.status(200).json(response(200, 'success update contact', contactAfterUpdate));

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

}