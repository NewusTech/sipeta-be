const { response } = require('../../helpers/response.formatter');

const { Kecamatan } = require('../../models');
const { generatePagination } = require('../../pagination/pagination');
const Validator = require("fastest-validator");
const v = new Validator();
const { Op } = require('sequelize');

module.exports = {

    //mendapatkan semua data kecamatan
    getkecamatan: async (req, res) => {
        try {
            let kecamatanGets;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search ?? null;

            if (search) {
                [kecamatanGets, totalCount] = await Promise.all([
                    Kecamatan.findAll({
                        where: {
                           name: { [Op.iLike]: `%${search}%` } 
                        },
                        limit: limit,
                        offset: offset
                    }),
                    Kecamatan.count({
                        where: {
                            name: { [Op.iLike]: `%${search}%` } 
                         },
                    })
                ]);
            } else {
                [kecamatanGets, totalCount] = await Promise.all([
                    Kecamatan.findAll({
                        limit: limit,
                        offset: offset
                    }),
                    Kecamatan.count({
                    })
                ]);
            }

            const pagination = generatePagination(totalCount, page, limit, '/api/user/desa/get');

            res.status(200).json({
                status: 200,
                message: 'success get artikel',
                data: kecamatanGets,
                pagination: pagination
            });

        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    //mendapatkan data kecamatan berdasarkan id
    getkecamatanById: async (req, res) => {
        try {
            //mendapatkan data kecamatan berdasarkan id
            let kecamatanGet = await Kecamatan.findOne({
                where: {
                    id: req.params.id
                },
            });

            //cek jika kecamatan tidak ada
            if (!kecamatanGet) {
                res.status(404).json(response(404, 'kecamatan not found'));
                return;
            }

            //response menggunakan helper response.formatter
            res.status(200).json(response(200, 'success get kecamatan by id', kecamatanGet));
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },
}