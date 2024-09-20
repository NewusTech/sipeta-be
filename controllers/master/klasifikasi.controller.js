const { response } = require('../../helpers/response.formatter');

const { Klasifikasi } = require('../../models');
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {

    //membuat klasifikasi
    createklasifikasi: async (req, res) => {
        try {

            //membuat schema untuk validasi
            const schema = {
                name: {
                    type: "string",
                    min: 3,
                },
            }

            //buat object klasifikasi
            let klasifikasiCreateObj = {
                name: req.body.name,
            }

            //validasi menggunakan module fastest-validator
            const validate = v.validate(klasifikasiCreateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            //buat klasifikasi
            let klasifikasiCreate = await Klasifikasi.create(klasifikasiCreateObj);

            res.status(201).json(response(201, 'success create klasifikasi', klasifikasiCreate));
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    //mendapatkan semua data klasifikasi
    getklasifikasi: async (req, res) => {
        try {
            //mendapatkan data semua klasifikasi
            let klasifikasiGets = await Klasifikasi.findAll({});

            res.status(200).json(response(200, 'success get klasifikasi', klasifikasiGets));

        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    //mendapatkan data klasifikasi berdasarkan id
    getklasifikasiById: async (req, res) => {
        try {
            //mendapatkan data klasifikasi berdasarkan id
            let klasifikasiGet = await Klasifikasi.findOne({
                where: {
                    id: req.params.id
                },
            });

            //cek jika klasifikasi tidak ada
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

    //mengupdate klasifikasi berdasarkan id
    updateklasifikasi: async (req, res) => {
        try {
            //mendapatkan data klasifikasi untuk pengecekan
            let klasifikasiGet = await Klasifikasi.findOne({
                where: {
                    id: req.params.id
                }
            })

            //cek apakah data klasifikasi ada
            if (!klasifikasiGet) {
                res.status(404).json(response(404, 'klasifikasi not found'));
                return;
            }

            //membuat schema untuk validasi
            const schema = {
                name: {
                    type: "string",
                    min: 3,
                    optional: true
                },
            }

            //buat object klasifikasi
            let klasifikasiUpdateObj = {
                name: req.body.name,
            }

            //validasi menggunakan module fastest-validator
            const validate = v.validate(klasifikasiUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            //update klasifikasi
            await Klasifikasi.update(klasifikasiUpdateObj, {
                where: {
                    id: req.params.id,
                }
            })

            //mendapatkan data klasifikasi setelah update
            let klasifikasiAfterUpdate = await Klasifikasi.findOne({
                where: {
                    id: req.params.id,
                }
            })

            res.status(200).json(response(200, 'success update klasifikasi', klasifikasiAfterUpdate));

        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    //menghapus klasifikasi berdasarkan id
    deleteklasifikasi: async (req, res) => {
        try {

            //mendapatkan data klasifikasi untuk pengecekan
            let klasifikasiGet = await Klasifikasi.findOne({
                where: {
                    id: req.params.id
                }
            })

            //cek apakah data klasifikasi ada
            if (!klasifikasiGet) {
                res.status(404).json(response(404, 'klasifikasi not found'));
                return;
            }

            await Klasifikasi.destroy({
                where: {
                    id: req.params.id,
                }
            })

            res.status(200).json(response(200, 'success delete klasifikasi'));

        } catch (err) {
            if (err.name === 'SequelizeForeignKeyConstraintError') {
                res.status(400).json(response(400, 'Data tidak bisa dihapus karena masih digunakan pada tabel lain'));
            } else {
                res.status(500).json(response(500, 'Internal server error', err));
                console.log(err);
            }
        }
    }
}