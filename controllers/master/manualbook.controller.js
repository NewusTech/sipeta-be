const { response } = require('../../helpers/response.formatter');
const { Manualbook, sequelize } = require('../../models');
const { getKeyFromUrl } = require('../../helpers/awshelper.js');
const logger = require('../../errorHandler/logger');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    useAccelerateEndpoint: true
});

module.exports = {

    getmanualbook: async (req, res) => {
        try {
            let manualbookGet = await Manualbook.findAll({});

            if (!manualbookGet) {
                res.status(404).json(response(404, 'manualbook not found'));
                return;
            }

            res.status(200).json(response(200, 'success get', manualbookGet));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    getmanualbookbyid: async (req, res) => {
        try {
            let manualbookGet = await Manualbook.findOne({
                where: {
                    id: req.params.id
                },
            });

            if (!manualbookGet) {
                res.status(404).json(response(404, 'manualbook not found'));
                return;
            }

            res.status(200).json(response(200, 'success get', manualbookGet));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    updatemanualbook: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;

            const manualbook = await Manualbook.findByPk(id);
            if (!manualbook) {
                return res.status(404).json(response(404, 'Data tidak ditemukan'));
            }

            if (!req.files || !req.files.manualbook) {
                return res.status(400).json(response(400, 'File tidak disertakan'));
            }

            const file = req.files.manualbook[0];
            const timestamp = new Date().getTime();
            const uniqueFileName = `${timestamp}-${file.originalname}`;

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: `${process.env.PATH_AWS}/manualbook/${uniqueFileName}`,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            };

            const command = new PutObjectCommand(uploadParams);
            await s3Client.send(command);

            const manualbookKey = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

            if (manualbook.dokumen) {
                const key = getKeyFromUrl(manualbook.dokumen);
                if (!key) {
                    return res.status(400).json(response(400, 'URL tidak valid'));
                }

                if (manualbook.dokumen) {
                    const deleteParams = {
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: key
                    };
                    const deleteCommand = new DeleteObjectCommand(deleteParams);
                    await s3Client.send(deleteCommand);
                }
            }

            manualbook.dokumen = manualbookKey;
            await manualbook.save({ transaction });

            await transaction.commit();

            res.status(200).json(response(200, 'success update manualbook', manualbook));

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

}