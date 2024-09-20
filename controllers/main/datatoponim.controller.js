const { response } = require('../../helpers/response.formatter');

const { Datatoponim, Desa, Kecamatan, Unsur, Klasifikasi, sequelize } = require('../../models');
const Validator = require("fastest-validator");
const v = new Validator();

// Schema for validation
const schema = {
    id_toponim: { type: "string", optional: true },
    nama_tempat: { type: "string", optional: true },
    tipe_geometri: { type: "string", convert: true, optional: true },
    klasifikasi_id: { type: "string", convert: true, optional: true }, 
    unsur_id: { type: "string", convert: true, optional: true },
    koordinat: { type: "string", convert: true, optional: true },
    bujur: { type: "string", convert: true, optional: true },
    lintang: { type: "string", convert: true, optional: true },
    kecamatan_id: { type: "string", convert: true, optional: true },
    desa_id: { type: "string", convert: true, optional: true },
};

module.exports = {

    get: async (req, res) => {
        try {
            // Fetch all Datatoponim entries
            const toponims = await Datatoponim.findAll({
                include: [
                    {
                        model: Kecamatan,
                        attributes: ['name', 'id'],
                    },
                    {
                        model: Desa,
                        attributes: ['name', 'id'],
                    },
                    {
                        model: Unsur,
                        attributes: ['name', 'id'],
                    },
                    {
                        model: Klasifikasi,
                        attributes: ['name', 'id'],
                    }
                ],
            });

            // Response using helper response.formatter
            res.status(200).json(response(200, 'success fetch all toponims', toponims));
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;

            const toponim = await Datatoponim.findByPk(id, {
                include: [
                    {
                        model: Kecamatan,
                        attributes: ['name', 'id'],
                    },
                    {
                        model: Desa,
                        attributes: ['name', 'id'],
                    },
                    {
                        model: Unsur,
                        attributes: ['name', 'id'],
                    },
                    {
                        model: Klasifikasi,
                        attributes: ['name', 'id'],
                    }
                ],
            });
            if (!toponim) {
                res.status(404).json(response(404, 'Toponim not found'));
                return;
            }

            res.status(200).json(response(200, 'success fetch toponim', toponim));
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    create: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            // Create the object to be validated
            let toponimCreateObj = req.body;

            // Validate using fastest-validator
            const validate = v.validate(toponimCreateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            // Create the Datatoponim
            let toponimCreate = await Datatoponim.create(toponimCreateObj);

            await transaction.commit();

            // Response using helper response.formatter
            res.status(201).json(response(201, 'success create toponim', toponimCreate));
        } catch (err) {
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    update: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            // Get the id from the request params
            const { id } = req.params;

            // Create the object to be validated
            let toponimUpdateObj = req.body;

            // Validate using fastest-validator
            const validate = v.validate(toponimUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            // Find the existing Datatoponim entry
            const toponim = await Datatoponim.findByPk(id);
            if (!toponim) {
                res.status(404).json(response(404, 'Toponim not found'));
                return;
            }

            // Update the Datatoponim
            await toponim.update(toponimUpdateObj);

            await transaction.commit();

            // Response using helper response.formatter
            res.status(200).json(response(200, 'success update toponim', toponim));
        } catch (err) {
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    delete: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            // Get the id from the request params
            const { id } = req.params;

            // Find the existing Datatoponim entry
            const toponim = await Datatoponim.findByPk(id);
            if (!toponim) {
                res.status(404).json(response(404, 'Toponim not found'));
                return;
            }

            // Delete the Datatoponim entry
            await toponim.destroy();

            await transaction.commit();

            // Response using helper response.formatter
            res.status(200).json(response(200, 'success delete toponim'));
        } catch (err) {
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

}