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
    
            const desaPage = parseInt(req.query.desaPage) || 1; // Desa pagination page
            const desaLimit = parseInt(req.query.desaLimit) || 10; // Desa items per page
            const desaOffset = (desaPage - 1) * desaLimit;
    
            const whereClause = {};
    
            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } }
                ];
            }
    
            const kecamatans = await Kecamatan.findAll({
                where: whereClause,
                limit: limit,
                offset: offset
            });
    
            // Loop through each Kecamatan and get paginated Desas for each
            const kecamatanWithDesas = await Promise.all(
                kecamatans.map(async (kecamatan) => {
                    const { count: desaCount, rows: desaRows } = await Desa.findAndCountAll({
                        where: { kecamatan_id: kecamatan.id }, // Only get Desas for this Kecamatan
                        limit: desaLimit,
                        offset: desaOffset
                    });
    
                    return {
                        ...kecamatan.toJSON(), // Include all Kecamatan fields
                        Desas: {
                            data: desaRows, // Paginated Desa data
                            pagination: {
                                page: desaPage,
                                perPage: desaLimit,
                                totalPages: Math.ceil(desaCount / desaLimit),
                                totalCount: desaCount
                            }
                        }
                    };
                })
            );
    
            const totalCount = await Kecamatan.count({ where: whereClause });
            const pagination = generatePagination(totalCount, page, limit, '/api/kecamatan/get');
    
            res.status(200).json({
                status: 200,
                message: 'success get data',
                data: kecamatanWithDesas,
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