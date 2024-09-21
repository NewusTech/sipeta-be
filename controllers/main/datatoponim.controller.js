const { response } = require('../../helpers/response.formatter');

const { Datatoponim, Detailtoponim, Desa, Kecamatan, Unsur, Klasifikasi, Fototoponim, sequelize } = require('../../models');
const { generatePagination } = require('../../pagination/pagination');
const Validator = require("fastest-validator");
const v = new Validator();
const { Op } = require('sequelize');

const schema = {
    id_toponim: { type: "string", optional: true },
    nama_lokal: { type: "string", optional: true },
    nama_spesifik: { type: "string", optional: true },
    nama_peta: { type: "string", optional: true },
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
            const { search, klasifikasi_id, unsur_id, kecamatan_id, desa_id } = req.query;
            const page = parseInt(req.query.page)|| 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const whereClause = {};
            const detailToponimWhereClause = {};
    
            if (search) {
                whereClause[Op.or] = [
                    { nama_lokal: { [Op.iLike]: `%${search}%` } },
                    { nama_spesifik: { [Op.iLike]: `%${search}%` } },
                    { nama_peta: { [Op.iLike]: `%${search}%` } },
                ];
    
                detailToponimWhereClause[Op.or] = [
                    { nama_lain: { [Op.iLike]: `%${search}%` } }
                ];
            }

            if (klasifikasi_id) whereClause.klasifikasi_id = klasifikasi_id;
            if (unsur_id) whereClause.unsur_id = unsur_id;
            if (kecamatan_id) whereClause.kecamatan_id = kecamatan_id;
            if (desa_id) whereClause.desa_id = desa_id;

            const includeModels = [
                { model: Kecamatan, attributes: ['name', 'id'] },
                { model: Desa, attributes: ['name', 'id'] },
                { model: Unsur, attributes: ['name', 'id'] },
                { model: Klasifikasi, attributes: ['name', 'id'] },
                { model: Detailtoponim, where: detailToponimWhereClause, required: false },
                { model: Fototoponim },
            ];

            const [dataGets, totalCount] = await Promise.all([
                Datatoponim.findAll({
                    where: whereClause,
                    limit: parseInt(limit),
                    offset,
                    include: includeModels,
                    order: [['id', 'DESC']]
                }),
                Datatoponim.count({
                    where: whereClause,
                    include: includeModels,
                })
            ]);

            const pagination = generatePagination(totalCount, page, limit, '/api/datatoponim/get');

            res.status(200).json({
                status: 200,
                message: 'success get data',
                data: dataGets,
                pagination: pagination
            });
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;

            const includeModels = [
                { model: Kecamatan, attributes: ['name', 'id'] },
                { model: Desa, attributes: ['name', 'id'] },
                { model: Unsur, attributes: ['name', 'id'] },
                { model: Klasifikasi, attributes: ['name', 'id'] },
                { model: Detailtoponim },
                { model: Fototoponim },
            ];

            const toponim = await Datatoponim.findByPk(id, {
                include: includeModels,
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
            let toponimCreateObj = req.body;

            const validate = v.validate(toponimCreateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            let toponimCreate = await Datatoponim.create(toponimCreateObj);

            await transaction.commit();

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
            const { id } = req.params;

            let toponimUpdateObj = req.body;

            const validate = v.validate(toponimUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            const toponim = await Datatoponim.findByPk(id);
            if (!toponim) {
                res.status(404).json(response(404, 'Toponim not found'));
                return;
            }

            await toponim.update(toponimUpdateObj);

            await transaction.commit();

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
            if (transaction) await transaction.rollback();

            if (err.name === 'SequelizeForeignKeyConstraintError') {
                res.status(400).json(response(400, 'Data tidak bisa dihapus karena masih digunakan pada tabel lain'));
            } else {
                res.status(500).json(response(500, 'Internal server error', err));
                console.log(err);
            }
        }
    },

}