const { response } = require('../../helpers/response.formatter');

const { Klasifikasi, sequelize } = require('../../models');
const Validator = require("fastest-validator");
const v = new Validator();
const logger = require('../../errorHandler/logger');

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
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err.message));
            console.log(err);
        }
    },

    get: async (req, res) => {
        try {
            let klasifikasiGets = await Klasifikasi.findAll({});

            res.status(200).json(response(200, 'success get klasifikasi', klasifikasiGets));

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err.message));
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
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err.message));
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
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err.message));
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
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            if (transaction) await transaction.rollback();

            if (err.name === 'SequelizeForeignKeyConstraintError') {
                res.status(400).json(response(400, 'Data tidak bisa dihapus karena masih digunakan pada tabel lain'));
            } else {
                res.status(500).json(response(500, 'internal server error', err.message));
                console.log(err);
            }
        }
    },
}