const { response } = require('../../helpers/response.formatter');

const { Datatoponim, Detailtoponim, Desa, Kecamatan, Unsur, Klasifikasi, Fototoponim, sequelize } = require('../../models');
const { generatePagination } = require('../../pagination/pagination');
const Validator = require("fastest-validator");
const v = new Validator();
const { Op } = require('sequelize');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

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
    status: { type: "string", convert: true, optional: true },
    verifiednotes: { type: "string", optional: true },
    verifiedat: { type: "string", optional: true },
};

module.exports = {

    get: async (req, res) => {
        try {

            const { search, klasifikasi_id, unsur_id, kecamatan_id, desa_id, status } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const whereClause = {};
            const detailToponimWhereClause = {};

            if (data?.role === "User" || !data?.role) {
                whereClause.status = 1;
            } else {
                if (status) whereClause.status = status;
            }

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

            toponimCreateObj.status = 0;

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

    pdf: async (req, res) => {
        try {
            const { search, klasifikasi_id, unsur_id, kecamatan_id, desa_id, status } = req.query;
            const whereClause = {};
            const detailToponimWhereClause = {};

            if (data?.role === "User" || !data?.role) {
                whereClause.status = 1;
            } else {
                if (status) whereClause.status = status;
            }

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

            const [dataGets] = await Promise.all([
                Datatoponim.findAll({
                    where: whereClause,
                    include: includeModels,
                    order: [['id', 'DESC']]
                }),
            ]);

            // Generate HTML content for PDF
            const templatePath = path.resolve(__dirname, '../../views/toponomi.html');
            let htmlContent = fs.readFileSync(templatePath, 'utf8');

            const reportTableRows = dataGets?.map(data => {
                const createdAtDate = new Date(data?.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
                const statusfix = data?.status === 1 ? 'Divalidasi' : data?.status === 2 ? 'Ditolak' : 'Belum Divalidasi';

                return `
                    <tr>
                        <td>${createdAtDate}</td>
                        <td>${statusfix}</td>
                        <td>${data?.id_toponim}</td>
                        <td>${data?.nama_lokal}</td>
                        <td>${data?.Kecamatan?.name}</td>
                        <td>${data?.Desa?.name}</td>
                        <td>${data?.Detailtoponim?.catatan ?? '-'}</td>
                    </tr>
                `;
            }).join('');

            htmlContent = htmlContent.replace('{{reportTableRows}}', reportTableRows);

            // Launch Puppeteer
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();

            // Set HTML content
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

            // Generate PDF
            const pdfBuffer = await page.pdf({
                format: 'Legal',
                landscape: true,
                margin: {
                    top: '1.16in',
                    right: '1.16in',
                    bottom: '1.16in',
                    left: '1.16in'
                }
            });

            await browser.close();

            // Generate filename
            const currentDate = new Date().toISOString().replace(/:/g, '-');
            const filename = `laporan-${currentDate}.pdf`;

            // Send PDF buffer
            res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
            res.setHeader('Content-type', 'application/pdf');
            res.send(pdfBuffer);

        } catch (err) {
            res.status(500).json(response(500, 'Internal server error', err));
            console.log(err);
        }
    },

    excel: async (req, res) => {
        try {
            const { search, klasifikasi_id, unsur_id, kecamatan_id, desa_id, status } = req.query;
            const whereClause = {};
            const detailToponimWhereClause = {};

            if (search) {
                whereClause[Op.or] = [
                    { nama_lokal: { [Op.iLike]: `%${search}%` } },
                    { nama_spesifik: { [Op.iLike]: `%${search}%` } },
                    { nama_peta: { [Op.iLike]: `%${search}%` } }
                ];
                detailToponimWhereClause[Op.or] = [
                    { nama_lain: { [Op.iLike]: `%${search}%` } }
                ];
            }

            if (klasifikasi_id) whereClause.klasifikasi_id = klasifikasi_id;
            if (unsur_id) whereClause.unsur_id = unsur_id;
            if (kecamatan_id) whereClause.kecamatan_id = kecamatan_id;
            if (desa_id) whereClause.desa_id = desa_id;
            if (status) whereClause.status = status;

            const dataGets = await Datatoponim.findAll({
                where: whereClause,
                include: [
                    { model: Kecamatan, attributes: ['name', 'id'] },
                    { model: Desa, attributes: ['name', 'id'] },
                    { model: Unsur, attributes: ['name', 'id'] },
                    { model: Klasifikasi, attributes: ['name', 'id'] },
                    { model: Detailtoponim, where: detailToponimWhereClause, required: false },
                    { model: Fototoponim },
                ],
                order: [['id', 'DESC']]
            });

            const exportData = dataGets.map(item => ({
                Tanggal: new Date(item.createdAt).toLocaleDateString(),
                Status: item?.status === 1 ? 'Divalidasi' : item?.status === 2 ? 'Ditolak' : 'Belum Divalidasi',
                ID_Toponim: item.id_toponim,
                Nama_Tempat: item.nama_lokal,
                Kecamatan: item.Kecamatan.name,
                Desa: item.Desa.name,
                Keterangan: item.verifiednotes || '-'
            }));

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Pendataan Nama Rupabumi');

            worksheet.mergeCells('A1:G1');
            worksheet.getCell('A1').value = 'Pendataan Nama Rupabumi';
            worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('A1').font = { size: 16, bold: true };

            worksheet.getRow(3).values = ['Tanggal', 'Status', 'ID_Toponim', 'Nama Tempat', 'Kecamatan', 'Desa', 'Keterangan'];
            worksheet.columns = [
                { key: 'Tanggal', width: 20 },
                { key: 'Status', width: 15 },
                { key: 'ID_Toponim', width: 15 },
                { key: 'Nama_Tempat', width: 30 },
                { key: 'Kecamatan', width: 25 },
                { key: 'Desa', width: 25 },
                { key: 'Keterangan', width: 30 }
            ];

            worksheet.getRow(3).eachCell(cell => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'D3D3D3' } 
                  };
              });

            exportData.forEach((data, index) => {
                const row = worksheet.addRow(data, 'n');
                
                row.eachCell(cell => {
                  cell.alignment = { vertical: 'middle', horizontal: 'left' };
                });
              });

            worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                if (rowNumber >= 2) { 
                    row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                }
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Pendataan_Rupabumi_${new Date().getTime()}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();
        } catch (err) {
            res.status(500).json(response(500, 'Internal server error', err));
            console.log(err);
        }
    },

}