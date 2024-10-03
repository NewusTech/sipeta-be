const { response } = require('../../helpers/response.formatter');

const { Mapslampura, User } = require('../../models');

const Validator = require("fastest-validator");
const v = new Validator();
const { Op } = require('sequelize');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const Redis = require("ioredis");
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    useAccelerateEndpoint: true
});

module.exports = {

    getmapslampura: async (req, res) => {
        try {
            //mendapatkan data mapslampura berdasarkan id
            let mapslampuraGet = await Mapslampura.findOne();

            //cek jika mapslampura tidak ada
            if (!mapslampuraGet) {
                res.status(404).json(response(404, 'mapslampura not found'));
                return;
            }

            //response menggunakan helper response.formatter
            res.status(200).json(response(200, 'success get mapslampura by id', mapslampuraGet));
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    updatemapslampura: async (req, res) => {
        try {
            // Mendapatkan data mapslampura untuk pengecekan
            let mapslampuraGet = await Mapslampura.findOne();
    
            // Cek apakah data mapslampura ada
            if (!mapslampuraGet) {
                res.status(404).json(response(404, 'mapslampura not found'));
                return;
            }
    
            // Membuat schema untuk validasi
            const schema = {
                file: {
                    type: "string",
                    optional: true
                }
            };
    
            let mapslampuraKey;
    
            if (req.file) {
                const timestamp = new Date().getTime();
                const uniqueFileName = `${timestamp}-${req.file.originalname}`;
    
                const redisKey = `upload:mapslampura:${mapslampuraGet.id}`;
                await redisClient.set(redisKey, JSON.stringify({
                    buffer: req.file.buffer,
                    mimetype: req.file.mimetype,
                    uniqueFileName,
                    folderPath: `${process.env.PATH_AWS}/mapslampura`
                }), 'EX', 60 * 60); 
    
                mapslampuraKey = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.PATH_AWS}/mapslampura/${uniqueFileName}`;
            }
    
            // Buat object mapslampura
            let mapslampuraUpdateObj = {
                file: req.file ? mapslampuraKey : undefined,
            };
    
            // Validasi menggunakan module fastest-validator
            const validate = v.validate(mapslampuraUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }
    
            // Update mapslampura
            await Mapslampura.update(mapslampuraUpdateObj, {
                where: {
                    id: mapslampuraGet.id,
                },
            });
    
            // Mendapatkan data mapslampura setelah update
            let mapslampuraAfterUpdate = await Mapslampura.findOne();
    
            // Mulai proses background untuk mengunggah ke S3
            if (req.file) {
                setTimeout(async () => {
                    const redisKey = `upload:mapslampura:${mapslampuraGet.id}`;
                    const fileData = await redisClient.get(redisKey);
    
                    if (fileData) {
                        const { buffer, mimetype, uniqueFileName, folderPath } = JSON.parse(fileData);
                        const uploadParams = {
                            Bucket: process.env.AWS_S3_BUCKET,
                            Key: `${folderPath}/${uniqueFileName}`,
                            Body: Buffer.from(buffer),
                            ACL: 'public-read',
                            ContentType: mimetype
                        };
                        const command = new PutObjectCommand(uploadParams);
                        await s3Client.send(command);
                        await redisClient.del(redisKey); // Hapus dari Redis setelah berhasil diunggah
                    }
                }, 0); // Jalankan segera dalam background
            }
    
            // Response menggunakan helper response.formatter
            res.status(200).json(response(200, 'success update mapslampura', mapslampuraAfterUpdate));
    
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

    updatecountmapslampura: async () => {
        try {
            let mapslampuraGet = await Mapslampura.findOne();
    
            if (!mapslampuraGet) {
                res.status(404).json(response(404, 'mapslampura not found'));
                return;
            }

            const [count_surveyor, count_kontributor] = await Promise.all([
                User.count({
                    where: {
                        role_id: 3,
                        deletedAt: null
                    },
                }),
                User.count({
                    where: {
                        role_id: 4,
                        deletedAt: null
                    },
                })
            ]);
    
            // Buat object mapslampura
            let mapslampuraUpdateObj = {
                count_surveyor: count_surveyor,
                count_kontributor: count_kontributor,
            };
    
            // Update mapslampura
            await Mapslampura.update(mapslampuraUpdateObj, {
                where: {
                    id: mapslampuraGet.id,
                },
            });
    
            // Mendapatkan data mapslampura setelah update
            let mapslampuraAfterUpdate = await Mapslampura.findOne();
    
            // Response menggunakan helper response.formatter
            return mapslampuraAfterUpdate;
    
        } catch (err) {
            res.status(500).json(response(500, 'internal server error', err));
            console.log(err);
        }
    },

}