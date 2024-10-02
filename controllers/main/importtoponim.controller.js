const { Datatoponim, Detailtoponim, Desa, Kecamatan, Unsur, Klasifikasi, Fototoponim, sequelize } = require('../../models');
const fs = require('fs');

const getKlasifikasiId = async (klasifikasiName) => {
    const klasifikasi = await Klasifikasi.findOne({ where: { name: klasifikasiName } });
    return klasifikasi ? klasifikasi.id : null;
};

const getUnsurId = async (unsurName) => {
    const unsur = await Unsur.findOne({ where: { name: unsurName } });
    return unsur ? unsur.id : null;
};

const getKecamatanId = async (kecamatanName) => {
    const formattedKecamatanName = kecamatanName.replace(/Kecamatan\s*/, '');
    const kecamatan = await Kecamatan.findOne({ where: { name: formattedKecamatanName } });
    return kecamatan ? kecamatan.id : null;
};

const getDesaId = async (desaName) => {
    const formattedDesaName = desaName.replace(/Kelurahan\s*/, '');
    const desa = await Desa.findOne({ where: { name: formattedDesaName } });
    return desa ? desa.id : null;
};

const saveFototoponim = async (datatoponimId, properties) => {
    const fotoUrls = [properties.foto1, properties.foto2, properties.foto3, properties.foto4];

    for (const fotoUrl of fotoUrls) {
        if (fotoUrl) {
            const newFotoToponim = {
                datatoponim_id: datatoponimId,
                foto_url: fotoUrl,
            };
            await Fototoponim.create(newFotoToponim);
        }
    }
};

module.exports = {

    importJson: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Membaca data JSON dari buffer
            const jsonData = JSON.parse(req.file.buffer.toString());

            const toponimData = [];
            const detailToponimData = [];

            // Batch process klasifikasi, kecamatan, and desa lookups
            const klasifikasiCache = {};
            const kecamatanCache = {};
            const desaCache = {};

            // Proses data JSON untuk menyimpannya ke database
            for (const feature of jsonData.features) {
                const properties = feature?.properties;
                const geometry = feature?.geometry;

                // Klasifikasi caching to avoid duplicate DB lookups
                let klasifikasi_id = klasifikasiCache[properties?.klstpn];
                if (!klasifikasi_id) {
                    klasifikasi_id = await getKlasifikasiId(properties?.klstpn);
                    klasifikasiCache[properties?.klstpn] = klasifikasi_id;
                }

                // Kecamatan caching to avoid duplicate DB lookups
                let kecamatan_id = kecamatanCache[properties?.wadmkc];
                if (!kecamatan_id) {
                    kecamatan_id = await getKecamatanId(properties?.wadmkc);
                    kecamatanCache[properties?.wadmkc] = kecamatan_id;
                }

                // Desa caching to avoid duplicate DB lookups
                let desa_id = desaCache[properties?.wadmkd];
                if (!desa_id) {
                    desa_id = await getDesaId(properties?.wadmkd);
                    desaCache[properties?.wadmkd] = desa_id;
                }

                const newDatatoponim = {
                    statpub: properties?.statpub,
                    statpem: properties?.statpem,
                    id_toponim: properties?.id_toponim,
                    nama_lokal: properties?.namlok,
                    nama_spesifik: properties?.namspe,
                    nama_peta: properties?.nammap,
                    tipe_geometri: geometry?.type === "Point" || geometry?.type === "Titik" ? 1 : geometry?.type === "Garis" || geometry?.type === "LineString" ? 2 : geometry?.type === "Area" || geometry?.type === "Polygon" ? 3 : null,
                    klasifikasi_id,
                    unsur_id: properties?.id_unsur,
                    koordinat: properties?.koordinat1,
                    bujur: properties?.koordx,
                    lintang: properties?.koordy,
                    kecamatan_id,
                    desa_id,
                    sketsa: properties?.sketsa,
                    docpendukung: properties?.docpendukung,
                    status: properties.status === 'Proses' ? 0 : 1,
                    verifiedat: properties.status !== 'Proses' ? properties.tglsurvei || new Date().toISOString() : null,
                    verifiednoted: properties?.verifiednoted,
                    createdAt: properties.tglsurvei,
                    updatedAt: properties.tglsurvei,
                };

                // Simpan Datatoponim
                let DataToponimsave = await Datatoponim.create(newDatatoponim);

                const newDetailtoponim = {
                    datatoponim_id: DataToponimsave.id,
                    zona_utm: properties.zonautm,
                    nlp: properties.nlp,
                    klstpn: properties.klstpn,
                    lcode: properties.lcode,
                    nama_gazeter: properties.namgaz,
                    nama_lain: properties.alias,
                    asal_bahasa: properties.aslbhs,
                    arti_nama: properties.artinam,
                    sejarah_nama: properties.sjhnam,
                    nama_sebelumnya: properties.nambef,
                    nama_rekomendasi: properties.namrec,
                    ucapan: properties.ucapan,
                    ejaan: properties.ejaan,
                    nilai_ketinggian: properties.elevasi,
                    akurasi: properties.akurasi,
                    narasumber: properties.narsum,
                    sumber_data: properties.sumber,
                    createdAt: properties.tglsurvei,
                    updatedAt: properties.tglsurvei,
                };

                // Simpan Detailtoponim
                await Detailtoponim.create(newDetailtoponim);

                // Simpan foto-foto (jika ada)
                await saveFototoponim(DataToponimsave.id, properties);
            }

            res.status(201).json({ message: 'Import successful!' });
        } catch (error) {
            console.error('Error importing data: ', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

}