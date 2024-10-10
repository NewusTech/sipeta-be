const { response } = require('../../helpers/response.formatter');

const { Unsur } = require('../../models');
const Validator = require("fastest-validator");
const v = new Validator();
const logger = require('../../errorHandler/logger');

module.exports = {

    input: async (req, res) => {
        try {

            //membuat schema untuk validasi
            const schema = {
                klasifikasi_id: { type: "number" },
                name: { type: "string", optional: true },
            }

            //buat object unsur
            let unsurCreateObj = {
                klasifikasi_id: Number(req.body.klasifikasi_id),
                name: req.body.name,
            }

            //validasi menggunakan module fastest-validator
            const validate = v.validate(unsurCreateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            //buat unsur
            let unsurCreate = await Unsur.create(unsurCreateObj);

            //response menggunakan helper response.formatter
            res.status(201).json(response(201, 'success create', unsurCreate));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err.message));
            console.log(err);
        }
    },

    get: async (req, res) => {
        try {
            const id = req.params.id;

            let unsurData = await Unsur.findAll({});

            if (!unsurData) {
                res.status(404).json(response(404, 'data not found'));
                return;
            }

            res.status(200).json(response(200, 'success get data', unsurData));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err.message));
            console.log(err);
        }
    },

    getbyid: async (req, res) => {
        try {

            let UnsurGet = await Unsur.findAll({
                where: {
                    klasifikasi_id: req.params.id
                },
            });

            //cek jika Unsur tidak ada
            if (!UnsurGet) {
                res.status(404).json(response(404, 'Unsur not found'));
                return;
            }

            //response menggunakan helper response.formatter
            res.status(200).json(response(200, 'success get Unsur by slug', UnsurGet));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err.message));
            console.log(err);
        }
    },

    update: async (req, res) => {
        try {
            //mendapatkan data unsur untuk pengecekan
            let unsurGet = await Unsur.findOne({
                where: {
                    id: req.params.id,
                }
            })

            //cek apakah data unsur ada
            if (!unsurGet) {
                res.status(404).json(response(404, 'data not found'));
                return;
            }

            //membuat schema untuk validasi
            const schema = {
                name: { type: "string", optional: true },
            }

            //buat object unsur
            let unsurUpdateObj = {
                name: req.body.name
            }

            //validasi menggunakan module fastest-validator
            const validate = v.validate(unsurUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            //update unsur
            await Unsur.update(unsurUpdateObj, {
                where: {
                    id: req.params.id,
                }
            })

            //response menggunakan helper response.formatter
            res.status(200).json(response(200, 'success update'));

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err.message));
            console.log(err);
        }
    },

    delete: async (req, res) => {
        try {

            //mendapatkan data Unsur untuk pengecekan
            let UnsurGet = await Unsur.findOne({
                where: {
                    id: req.params.id
                }
            })

            //cek apakah data Unsur ada
            if (!UnsurGet) {
                res.status(404).json(response(404, 'Unsur not found'));
                return;
            }

            await Unsur.destroy({
                where: {
                    id: req.params.id,
                }
            })

            res.status(200).json(response(200, 'success delete Unsur'));

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            if (err.name === 'SequelizeForeignKeyConstraintError') {
                res.status(400).json(response(400, 'Data tidak bisa dihapus karena masih digunakan pada tabel lain'));
            } else {
                res.status(500).json(response(500, 'internal server error', err.message));
                console.log(err);
            }
        }
    }
}