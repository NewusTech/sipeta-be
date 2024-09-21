const { response } = require('../../helpers/response.formatter');

const { Desa, Kecamatan, sequelize } = require('../../models');
const { generatePagination } = require('../../pagination/pagination');
const Validator = require("fastest-validator");
const v = new Validator();
const { Op } = require('sequelize');

const schema = {
    name: { type: "string", optional: true },
    alamat: { type: "string", optional: true },
    camat: { type: "string", optional: true },
    telp: { type: "string", optional: true },
};

module.exports = {

    create: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            let kecamatanCreateObj = req.body;

            const validate = v.validate(kecamatanCreateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            let kecamatanCreate = await Kecamatan.create(kecamatanCreateObj);

            await transaction.commit();

            res.status(201).json(response(201, 'success create kecamatan', kecamatanCreate));
        } catch (err) {
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    get: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search ?? null;

            const whereClause = {};

            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const includeModels = [
                { model: Desa}
            ];

            const [kecamatanGets, totalCount] = await Promise.all([
                Kecamatan.findAll({
                    where: whereClause,
                    include: includeModels,
                    limit: limit,
                    offset: offset
                }),
                Kecamatan.count({ 
                    where: whereClause ,
                })
            ]);

            const pagination = generatePagination(totalCount, page, limit, '/api/kecamatan/get');

            res.status(200).json({
                status: 200,
                message: 'success get data',
                data: kecamatanGets,
                pagination: pagination
            });

        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    getById: async (req, res) => {
        try {

            const includeModels = [
                { model: Desa}
            ];

            let kecamatanGet = await Kecamatan.findOne({
                include: includeModels,
                where: {
                    id: req.params.id
                },
            });

            if (!kecamatanGet) {
                res.status(404).json(response(404, 'kecamatan not found'));
                return;
            }

            res.status(200).json(response(200, 'success get kecamatan by id', kecamatanGet));
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    update: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            let kecamatanUpdateObj = req.body;

            const validate = v.validate(kecamatanUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            const kecamatan = await Kecamatan.findByPk(id);
            if (!kecamatan) {
                res.status(404).json(response(404, 'Data not found'));
                return;
            }

            await kecamatan.update(kecamatanUpdateObj);

            await transaction.commit();

            res.status(200).json(response(200, 'success update kecamatan', kecamatan));
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

            const kecamatan = await Kecamatan.findByPk(id);
            if (!kecamatan) {
                res.status(404).json(response(404, 'Data not found'));
                return;
            }

            await kecamatan.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'success delete kecamatan'));
        } catch (err) {
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },
}