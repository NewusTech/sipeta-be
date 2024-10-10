const { response } = require('../../helpers/response.formatter');

const { Desa, sequelize } = require('../../models');
const { generatePagination } = require('../../pagination/pagination');
const Validator = require("fastest-validator");
const v = new Validator();
const { Op } = require('sequelize');
const logger = require('../../errorHandler/logger');

const schema = {
    name: { type: "string", optional: true },
    alamat: { type: "string", optional: true },
    kepala: { type: "string", optional: true },
    telp: { type: "string", optional: true },
    kecamatan_id: { type: "string", convert: true, optional: true }
};

module.exports = {

    create: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            let desaCreateObj = req.body;

            const validate = v.validate(desaCreateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            let desaCreate = await Desa.create(desaCreateObj);

            await transaction.commit();

            res.status(201).json(response(201, 'success create desa', desaCreate));
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
            let desaGets;
            const search = req.query.search ?? null;
            const kecamatan_id = req.query.kecamatan_id ?? null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            let totalCount;

            let filter = {};

            if (search) {
                filter.name = { [Op.iLike]: `%${search}%` };
            }
    
            if (kecamatan_id) {
                filter.kecamatan_id = kecamatan_id;
            }

            [desaGets, totalCount] = await Promise.all([
                Desa.findAll({
                    where: filter,
                    limit: limit,
                    offset: offset
                }),
                Desa.count({
                    where: filter,
                })
            ]);

            const pagination = generatePagination(totalCount, page, limit, '/api/desa/get');

            res.status(200).json({
                status: 200,
                message: 'success get artikel',
                data: desaGets,
                pagination: pagination
            });

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err.message));
            console.log(err);
        }
    },

    getById: async (req, res) => {
        try {
            let desaGet = await Desa.findOne({
                where: {
                    id: req.params.id
                },
            });

            if (!desaGet) {
                res.status(404).json(response(404, 'desa not found'));
                return;
            }

            res.status(200).json(response(200, 'success get desa by id', desaGet));
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

            let desanUpdateObj = req.body;

            const validate = v.validate(desanUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            const desan = await Desa.findByPk(id);
            if (!desan) {
                res.status(404).json(response(404, 'Data not found'));
                return;
            }

            await desan.update(desanUpdateObj);

            await transaction.commit();

            res.status(200).json(response(200, 'success update data', desan));
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

            const kecamatan = await Desa.findByPk(id);
            if (!kecamatan) {
                res.status(404).json(response(404, 'Data not found'));
                return;
            }

            await kecamatan.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'success delete data'));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            await transaction.rollback();
            res.status(500).json(response(500, 'internal server error', err.message));
            console.log(err);
        }
    },
}