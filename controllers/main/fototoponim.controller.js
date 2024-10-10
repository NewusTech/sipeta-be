const { response } = require('../../helpers/response.formatter');

const { Datatoponim, Fototoponim, sequelize } = require('../../models');
const { getKeyFromUrl } = require('../../helpers/awshelper.js');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const logger = require('../../errorHandler/logger');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    useAccelerateEndpoint: true
});

module.exports = {

    getfototoponim: async (req, res) => {
        try {
            const { datatoponim_id } = req.params;

            const fotoToponim = await Fototoponim.findAll({
                where: { datatoponim_id: datatoponim_id }
            });

            if (!fotoToponim) {
                return res.status(404).json(response(404, 'Detailtoponim not found'));
            }

            res.status(200).json(response(200, 'Detailtoponim found', fotoToponim));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'Internal server error', err));
        }
    },

    createFototoponim: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            const toponim = await Datatoponim.findByPk(id);
            if (!toponim) {
                return res.status(404).json(response(404, 'Datatoponim tidak ditemukan'));
            }

            if (!req.files || !req.files.foto) {
                return res.status(400).json(response(400, 'File tidak disertakan'));
            }

            const file = req.files.foto[0];
            const timestamp = new Date().getTime();
            const uniqueFileName = `${timestamp}-${file.originalname}`;

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: `${process.env.PATH_AWS}/fototoponim/${uniqueFileName}`,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype
            };

            const command = new PutObjectCommand(uploadParams);
            await s3Client.send(command);

            const fotoKey = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

            Fototoponim.create({
                datatoponim_id: id,
                foto_url: fotoKey,
            });

            await toponim.save({ transaction });

            await transaction.commit();
            res.status(200).json(response(200, 'Foto berhasil disubmit', toponim));

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            await transaction.rollback();
            console.log(err);
            res.status(500).json(response(500, 'internal server error', err));
        }
    },

    updateSketsa: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            const toponim = await Datatoponim.findByPk(id);
            if (!toponim) {
                return res.status(404).json(response(404, 'Datatoponim tidak ditemukan'));
            }

            if (!req.files || !req.files.sketsa) {
                return res.status(400).json(response(400, 'File sketsa tidak disertakan'));
            }

            const file = req.files.sketsa[0];
            const timestamp = new Date().getTime();
            const uniqueFileName = `${timestamp}-${file.originalname}`;

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: `${process.env.PATH_AWS}/sketsa/${uniqueFileName}`,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            };

            const command = new PutObjectCommand(uploadParams);
            await s3Client.send(command);

            const sketsaKey = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

            if (toponim.sketsa) {
                const key = getKeyFromUrl(toponim.sketsa);
                if (!key) {
                    return res.status(400).json(response(400, 'Sketsa URL tidak valid'));
                }

                // Hapus sketsa lama dari S3 jika ada
                if (toponim.sketsa) {
                    const deleteParams = {
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: key
                    };
                    const deleteCommand = new DeleteObjectCommand(deleteParams);
                    await s3Client.send(deleteCommand);
                }
            }

            toponim.sketsa = sketsaKey;
            await toponim.save({ transaction });

            await transaction.commit();
            res.status(200).json(response(200, 'Sketsa berhasil diupdate', toponim));

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            await transaction.rollback();
            console.log(err);
            res.status(500).json(response(500, 'internal server error', err));
        }
    },

    updateDocpendukung: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            const toponim = await Datatoponim.findByPk(id);
            if (!toponim) {
                return res.status(404).json(response(404, 'Datatoponim tidak ditemukan'));
            }

            if (!req.files || !req.files.docpendukung) {
                return res.status(400).json(response(400, 'File docpendukung tidak disertakan'));
            }

            const file = req.files.docpendukung[0];
            const timestamp = new Date().getTime();
            const uniqueFileName = `${timestamp}-${file.originalname}`;

            // Upload docpendukung baru ke S3
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: `${process.env.PATH_AWS}/docpendukung/${uniqueFileName}`,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            };

            const command = new PutObjectCommand(uploadParams);
            await s3Client.send(command);

            const docpendukungKey = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

            if (toponim.docpendukung) {
                const key = getKeyFromUrl(toponim.docpendukung);
                if (!key) {
                    return res.status(400).json(response(400, 'URL tidak valid'));
                }

                // Hapus docpendukung lama dari S3 jika ada
                if (toponim.docpendukung) {
                    const deleteParams = {
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: key
                    };
                    const deleteCommand = new DeleteObjectCommand(deleteParams);
                    await s3Client.send(deleteCommand);
                }
            }

            // Update docpendukung di database
            toponim.docpendukung = docpendukungKey;
            await toponim.save({ transaction });

            await transaction.commit();
            res.status(200).json(response(200, 'Docpendukung berhasil diupdate', toponim));

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            await transaction.rollback();
            console.log(err);
            res.status(500).json(response(500, 'internal server error', err));
        }
    },

    updateFototoponim: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            const toponim = await Fototoponim.findByPk(id);
            if (!toponim) {
                return res.status(404).json(response(404, 'Fototoponim tidak ditemukan'));
            }

            if (!req.files || !req.files.foto) {
                return res.status(400).json(response(400, 'File foto tidak disertakan'));
            }

            const file = req.files.foto[0];
            const timestamp = new Date().getTime();
            const uniqueFileName = `${timestamp}-${file.originalname}`;

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: `${process.env.PATH_AWS}/fototoponim/${uniqueFileName}`,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            };

            const command = new PutObjectCommand(uploadParams);
            await s3Client.send(command);

            const fotoKey = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

            if (toponim.foto_url) {
                const key = getKeyFromUrl(toponim.foto_url);
                if (!key) {
                    return res.status(400).json(response(400, 'Sketsa URL tidak valid'));
                }

                // Hapus foto_url lama dari S3 jika ada
                if (toponim.foto_url) {
                    const deleteParams = {
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: key
                    };
                    const deleteCommand = new DeleteObjectCommand(deleteParams);
                    await s3Client.send(deleteCommand);
                }
            }

            // Update foto_url di database
            toponim.foto_url = fotoKey;
            await toponim.save({ transaction });

            await transaction.commit();
            res.status(200).json(response(200, 'Sketsa berhasil diupdate', toponim));

        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            await transaction.rollback();
            console.log(err);
            res.status(500).json(response(500, 'internal server error', err));
        }
    },

    deleteSketsa: async (req, res) => {
        try {
            const { id } = req.params;

            // Find the Datatoponim by id
            const toponim = await Datatoponim.findByPk(id);
            if (!toponim) {
                res.status(404).json(response(404, 'Datatoponim not found'));
                return;
            }

            if (!toponim.sketsa) {
                res.status(400).json(response(400, 'Sketsa does not exist for this Toponim'));
                return;
            }

            // Get the key from the Sketsa URL (after the S3 bucket URL)
            const key = getKeyFromUrl(toponim.sketsa);
            if (!key) {
                return res.status(400).json(response(400, 'Sketsa URL tidak valid'));
            }

            // Delete the object from S3
            const deleteParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key
            };

            const command = new DeleteObjectCommand(deleteParams);
            await s3Client.send(command);

            // Set sketsa to null in the Toponim record
            toponim.sketsa = null;
            await toponim.save();

            res.status(200).json(response(200, 'Sketsa deleted successfully'));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    deleteDocPendukung: async (req, res) => {
        try {
            const { id } = req.params;

            // Temukan toponim berdasarkan ID
            const toponim = await Datatoponim.findByPk(id);
            if (!toponim) {
                return res.status(404).json(response(404, 'Datatoponim tidak ditemukan'));
            }

            if (!toponim.docpendukung) {
                return res.status(400).json(response(400, 'Docpendukung tidak ada untuk Toponim ini'));
            }

            // Ambil key dari URL docpendukung
            const key = getKeyFromUrl(toponim.docpendukung);
            if (!key) {
                return res.status(400).json(response(400, 'Docpendukung URL tidak valid'));
            }

            // Hapus objek dari S3
            const deleteParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
            };

            const command = new DeleteObjectCommand(deleteParams);
            await s3Client.send(command);

            // Update docpendukung di database menjadi null
            toponim.docpendukung = null;
            await toponim.save();

            return res.status(200).json(response(200, 'Docpendukung berhasil dihapus'));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            return res.status(500).json(response(500, 'Internal server error', err));
        }
    },

    deleteFotoToponim: async (req, res) => {
        try {
            const { id } = req.params;

            // Cari foto toponim berdasarkan id
            const fotoToponim = await Fototoponim.findByPk(id);
            if (!fotoToponim) {
                return res.status(404).json(response(404, 'Foto Toponim tidak ditemukan'));
            }

            // Jika foto tidak ada di S3, hanya hapus dari database
            if (!fotoToponim.foto_url) {
                await Fototoponim.destroy({ where: { id: id } });
                return res.status(200).json(response(200, 'Foto Toponim berhasil dihapus dari database'));
            }

            const key = getKeyFromUrl(fotoToponim.foto_url);
            if (!key) {
                return res.status(400).json(response(400, 'URL foto tidak valid'));
            }

            // Hapus file dari S3
            const deleteParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key
            };

            const command = new DeleteObjectCommand(deleteParams);
            await s3Client.send(command);

            // Hapus dari database setelah dihapus dari S3
            await Fototoponim.destroy({ where: { id: id } });

            return res.status(200).json(response(200, 'Foto Toponim berhasil dihapus'));
        } catch (err) {
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            return res.status(500).json(response(500, 'Internal server error', err));
        }
    }

}