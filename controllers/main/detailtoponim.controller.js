const { response } = require('../../helpers/response.formatter');

const { Detailtoponim, sequelize } = require('../../models');
const Validator = require("fastest-validator");
const v = new Validator();
const logger = require('../../errorHandler/logger');

// Schema for validation
const schema = {
  datatoponim_id: { type: "number", convert: true, optional: true },
  zona_utm: { type: "string", optional: true },
  nlp: { type: "string", optional: true },
  lcode: { type: "string", optional: true },
  nama_gazeter: { type: "string", optional: true },
  nama_lain: { type: "string", optional: true },
  asal_bahasa: { type: "string", optional: true },
  arti_nama: { type: "string", optional: true },
  sejarah_nama: { type: "string", optional: true },
  nama_sebelumnya: { type: "string", optional: true },
  nama_rekomendasi: { type: "string", optional: true },
  ucapan: { type: "string", optional: true },
  ejaan: { type: "string", optional: true },
  nilai_ketinggian: { type: "number", convert: true, optional: true },
  akurasi: { type: "number", convert: true, optional: true },
  narasumber: { type: "string", optional: true },
  sumber_data: { type: "string", optional: true },
  catatan: { type: "string", optional: true },
};

module.exports = {

  createOrUpdate: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      let detailtoponimObj = req.body;

      const validate = v.validate(detailtoponimObj, schema);
      if (validate.length > 0) {
        res.status(400).json(response(400, 'validation failed', validate));
        return;
      }

      let existingDetail = await Detailtoponim.findOne({
        where: { datatoponim_id: detailtoponimObj.datatoponim_id }
      });

      let detailtoponim;

      if (existingDetail) {
        detailtoponim = await existingDetail.update(detailtoponimObj, { transaction });
        res.status(200).json(response(200, 'success update detail toponim', detailtoponim));
      } else {
        detailtoponim = await Detailtoponim.create(detailtoponimObj, { transaction });
        res.status(201).json(response(201, 'success create detail toponim', detailtoponim));
      }

      await transaction.commit();

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
      const { datatoponim_id } = req.params;

      const detailToponim = await Detailtoponim.findOne({
        where: { datatoponim_id: datatoponim_id }
      });

      if (!detailToponim) {
        return res.status(404).json(response(404, 'Detailtoponim not found'));
      }

      res.status(200).json(response(200, 'Detailtoponim found', detailToponim));
    } catch (err) {
      logger.error(`Error : ${err}`);
      logger.error(`Error message: ${err.message}`);
      res.status(500).json(response(500, 'internal server error', err.message));
    }
  },

  // Delete Detailtoponim by datatoponim_id
  delete: async (req, res) => {
    try {
      const { datatoponim_id } = req.params;

      const detailToponim = await Detailtoponim.findOne({
        where: { datatoponim_id: datatoponim_id }
      });

      if (!detailToponim) {
        return res.status(404).json(response(404, 'Detailtoponim not found'));
      }

      await detailToponim.destroy();

      res.status(200).json(response(200, 'Detailtoponim deleted successfully'));
    } catch (err) {
      logger.error(`Error : ${err}`);
      logger.error(`Error message: ${err.message}`);
      if (transaction) await transaction.rollback();

      if (err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(400).json(response(400, 'Data tidak bisa dihapus karena masih digunakan pada tabel lain'));
      } else {
        res.status(500).json(response(500, 'internal server error', err.message));
        console.log(err);
      }
    }
  }

}