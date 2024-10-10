const { response } = require('../../helpers/response.formatter');

const { Desa, Kecamatan, User, Userinfo, sequelize } = require('../../models');
const { generatePagination } = require('../../pagination/pagination');
const Validator = require("fastest-validator");
const v = new Validator();
const puppeteer = require('puppeteer');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const logger = require('../../errorHandler/logger');

const schema = {
    name: { type: "string", optional: true },
    alamat: { type: "string", optional: true },
    camat: { type: "string", optional: true },
    telp: { type: "string", optional: true },
};

const generateKecamatanRows = (kecamatans) => {
    return kecamatans.map(kecamatan => {
        const desaRows = kecamatan.Desas.data.map((desa, index) => {

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${capitalizeWords(desa.name)}</td>
                    <td>${capitalizeWords(desa.kepala || '-')}</td>
                    <td>${capitalizeWords(desa.alamat || '-')}</td>
                    <td>${desa.telp || '-'}</td>
                </tr>
            `;
        }).join('');

        return `
            <div class="kecamatan-info" style="margin-bottom:35px">
                <div class="kecamatan-title">Kecamatan ${kecamatan.name}</div>
                <pre class="text1">Alamat Kantor  : ${capitalizeWords(kecamatan.alamat || '-')}</pre>
                <pre class="text1">Telepon            : ${kecamatan.telp || '-'}</pre>
                <pre class="text1">Camat              : ${capitalizeWords(kecamatan.camat || '-')}</pre>

                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Kelurahan / Desa</th>
                            <th>Lurah / Kepala Desa</th>
                            <th>Alamat Kantor</th>
                            <th>Telepon</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${desaRows}
                    </tbody>
                </table>
            </div>
        `;
    }).join('');
};

const capitalizeWords = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
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

            const desaPage = parseInt(req.query.desaPage) || 1;
            const desaLimit = parseInt(req.query.desaLimit) || 10;
            const desaOffset = (desaPage - 1) * desaLimit;

            const whereClause = {};

            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const kecamatans = await Kecamatan.findAll({
                where: whereClause,
                order: [['id', 'ASC']],
                limit: limit,
                offset: offset
            });

            const kecamatanWithDesas = await Promise.all(
                kecamatans.map(async (kecamatan) => {
                    const { count: desaCount, rows: desaRows } = await Desa.findAndCountAll({
                        where: { kecamatan_id: kecamatan.id },
                        limit: desaLimit,
                        offset: desaOffset,
                        order: [['id', 'ASC']]
                    });

                    return {
                        ...kecamatan.toJSON(),
                        Desas: {
                            data: desaRows,
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
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    getById: async (req, res) => {
        try {

            const includeModels = [
                { model: Desa }
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
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
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
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
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
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            if (transaction) await transaction.rollback();

            if (err.name === 'SequelizeForeignKeyConstraintError') {
                res.status(400).json(response(400, 'Data tidak bisa dihapus karena masih digunakan pada tabel lain'));
            } else {
                res.status(500).json(response(500, 'Internal server error', err));
                console.log(err);
            }
        }
    },

    updatecountkecamatan: async () => {
        try {
            // Ambil semua kecamatan
            let kecamatanlampuraGet = await Kecamatan.findAll();

            if (!kecamatanlampuraGet || kecamatanlampuraGet.length === 0) {
                throw new Error('Kecamatan Lampura not found');
            }

            // Menyimpan hasil update untuk dikembalikan
            let updatedKecamatan = [];

            // Loop melalui setiap kecamatan dan hitung jumlah surveyor & kontributor berdasarkan kecamatan_id
            for (let kecamatan of kecamatanlampuraGet) {
                console.log("kecamatan", kecamatan.id);
                const [count_surveyor, count_kontributor] = await Promise.all([
                    User.count({
                        where: {
                            role_id: 3,
                            deletedAt: null
                        },
                        include: [
                            {
                                model: Userinfo,
                                where: {
                                    kecamatan_id: kecamatan.id,
                                    deletedAt: null
                                }
                            },
                        ],
                    }),
                    User.count({
                        where: {
                            role_id: 4,
                            deletedAt: null
                        },
                        include: [
                            {
                                model: Userinfo,
                                where: {
                                    kecamatan_id: kecamatan.id,
                                    deletedAt: null
                                }
                            },
                        ],
                    })
                ]);

                // Update data kecamatan dengan count_surveyor dan count_kontributor
                await Kecamatan.update(
                    {
                        count_surveyor: count_surveyor,
                        count_kontributor: count_kontributor,
                    },
                    {
                        where: {
                            id: kecamatan.id,
                        },
                    }
                );

                // Menyimpan hasil update dalam array
                updatedKecamatan.push({
                    kecamatan_id: kecamatan.id,
                    count_surveyor,
                    count_kontributor
                });
            }

            // Kembalikan hasil pembaruan kecamatan
            return updatedKecamatan;

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            console.log(err);
            throw err;
        }
    },

    generatePDF: async (req, res) => {
        try {
            const search = req.query.search ?? null;

            const whereClause = {};

            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const kecamatans = await Kecamatan.findAll({
                where: whereClause,
                order: [['id', 'ASC']],
            });

            const kecamatanWithDesas = await Promise.all(
                kecamatans.map(async (kecamatan) => {
                    const { count: desaCount, rows: desaRows } = await Desa.findAndCountAll({
                        where: { kecamatan_id: kecamatan.id },
                        order: [['id', 'ASC']],
                    });

                    return {
                        ...kecamatan.toJSON(),
                        Desas: {
                            data: desaRows,
                        }
                    };
                })
            ); // Assuming you have a function to get the data

            const templatePath = path.resolve(__dirname, '../../views/kecamatan.html');
            let htmlContent = fs.readFileSync(templatePath, 'utf8');

            // Replace the placeholder with the generated Kecamatan rows
            const kecamatanRows = generateKecamatanRows(kecamatanWithDesas);
            htmlContent = htmlContent.replace('{{kecamatanRows}}', kecamatanRows);

            // Generate PDF with Puppeteer
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({
                format: 'Legal',
                margin: { top: '0.8in', bottom: '0.8in', left: '0.8in', right: '0.8in' }
            });

            await browser.close();

            const currentDate = new Date().toISOString().replace(/:/g, '-');
            const filename = `kecamatan-lampungutara-${currentDate}.pdf`;

            res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
            res.setHeader('Content-type', 'application/pdf');
            res.send(pdfBuffer);
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, 'Internal server error', err));
            console.log(err);
        }
    }

}