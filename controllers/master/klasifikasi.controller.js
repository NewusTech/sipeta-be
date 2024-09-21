const { response } = require('../../helpers/response.formatter');

const { Klasifikasi, sequelize } = require('../../models');
const Validator = require("fastest-validator");
const v = new Validator();

const schema = {
    name: { type: "string", optional: true },
};

module.exports = {

    create: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            let klasifikasiCreateObj = req.body;

            const validate = v.validate(klasifikasiCreateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            let klasifikasiCreate = await Klasifikasi.create(klasifikasiCreateObj);

            await transaction.commit();

            res.status(201).json(response(201, 'success create klasifikasi', klasifikasiCreate));
        } catch (err) {
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    get: async (req, res) => {
        try {
            let klasifikasiGets = await Klasifikasi.findAll({});

            res.status(200).json(response(200, 'success get klasifikasi', klasifikasiGets));

        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    getById: async (req, res) => {
        try {
            let klasifikasiGet = await Klasifikasi.findOne({
                where: {
                    id: req.params.id
                },
            });

            if (!klasifikasiGet) {
                res.status(404).json(response(404, 'klasifikasi not found'));
                return;
            }

            res.status(200).json(response(200, 'success get klasifikasi by id', klasifikasiGet));
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    update: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            let klasifikasiUpdateObj = req.body;

            const validate = v.validate(klasifikasiUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            const klasifikasi = await Klasifikasi.findByPk(id);
            if (!klasifikasi) {
                res.status(404).json(response(404, 'Data not found'));
                return;
            }

            await klasifikasi.update(klasifikasiUpdateObj);

            await transaction.commit();

            res.status(200).json(response(200, 'success update klasifikasi', klasifikasi));
        } catch (err) {
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    delete: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            const klasifikasi = await Klasifikasi.findByPk(id);
            if (!klasifikasi) {
                res.status(404).json(response(404, 'Data not found'));
                return;
            }

            await klasifikasi.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'success delete klasifikasi'));
        } catch (err) {
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },
}