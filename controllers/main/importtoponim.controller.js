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
const csv = require('csv-parser');
const { Readable } = require('stream');

const getKlasifikasiId = async (klasifikasiName) => {
    const klasifikasi = await Klasifikasi.findOne({ where: { name: klasifikasiName } });
    return klasifikasi ? klasifikasi.id : null;
};

// Helper function untuk mendapatkan ID Unsur dari nama
const getUnsurId = async (unsurName) => {
    const unsur = await Unsur.findOne({ where: { name: unsurName } });
    return unsur ? unsur.id : null;
};

const getKecamatanId = async (kecamatanName) => {
    // Mengabaikan kata "Kecamatan" jika ada
    const formattedKecamatanName = kecamatanName.replace(/Kecamatan\s*/, '');
    const kecamatan = await Kecamatan.findOne({ where: { name: formattedKecamatanName } });
    return kecamatan ? kecamatan.id : null;
};

// Helper function untuk mendapatkan ID Desa dari nama
const getDesaId = async (desaName) => {
    // Mengabaikan kata "Kelurahan" jika ada
    const formattedDesaName = desaName.replace(/Kelurahan\s*/, '');
    const desa = await Desa.findOne({ where: { name: formattedDesaName } });
    return desa ? desa.id : null;
};

const checkEmpty = (value) => {
    return value === "" ? null : value;
};

const saveFototoponim = async (datatoponimId, properties) => {
    // Array untuk menyimpan semua foto yang ada
    const fotoUrls = [properties.foto1, properties.foto2, properties.foto3, properties.foto4];

    // Loop untuk menyimpan setiap foto jika ada
    for (const fotoUrl of fotoUrls) {
        if (fotoUrl) {
            const newFotoToponim = {
                datatoponim_id: datatoponimId,
                foto_url: fotoUrl,
            };
            await Fototoponim.create(newFotoToponim); // Simpan foto ke database
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

            for (const feature of jsonData.features) {
                const properties = feature?.properties;
                const geometry = feature?.geometry;

                let klasifikasi_id = klasifikasiCache[properties?.klstpn];
                if (!klasifikasi_id) {
                    klasifikasi_id = await getKlasifikasiId(properties?.klstpn);
                    klasifikasiCache[properties?.klstpn] = klasifikasi_id;
                }

                let kecamatan_id = kecamatanCache[properties?.wadmkc];
                if (!kecamatan_id) {
                    kecamatan_id = await getKecamatanId(properties?.wadmkc);
                    kecamatanCache[properties?.wadmkc] = kecamatan_id;
                }

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

    importExcel: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
    
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(req.file.buffer);
            const worksheet = workbook.worksheets[0]; // Assumes data is in the first sheet
    
            // Process each row in the worksheet
            const promises = [];
            worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row
    
                const properties = {
                    // statpub: row.getCell(1).value,  // Adjust column indexes based on your Excel structure
                    // statpem: row.getCell(2).value,
                    status: row.getCell(2).value,
                    namlok: row.getCell(4).value,
                    namspe: row.getCell(5).value,
                    id_toponim: row.getCell(8).value,
                    // nammap: row.getCell(6).value,
                    // koordx: row.getCell(7).value,
                    // koordy: row.getCell(8).value,
                    // wadmkc: row.getCell(9).value,
                    // wadmkd: row.getCell(10).value,
                    // sketsa: row.getCell(11).value,
                    // docpendukung: row.getCell(12).value,
                    // tglsurvei: row.getCell(14).value,
                    // foto1: row.getCell(15).value,
                    // foto2: row.getCell(16).value,
                    // foto3: row.getCell(17).value,
                    // foto4: row.getCell(18).value,
                    // klstpn: row.getCell(19).value,
                    // id_unsur: row.getCell(20).value,
                    // zonautm: row.getCell(21).value
                    // Add more fields as necessary
                };

                console.log(properties)
    
                const newDatatoponim = {
                    statpub: properties.statpub,
                    statpem: properties.statpem,
                    id_toponim: properties.id_toponim,
                    nama_lokal: properties.namlok,
                    nama_spesifik: properties.namspe,
                    nama_peta: properties.nammap,
                    bujur: properties.koordx,
                    lintang: properties.koordy,
                    kecamatan_id: properties.wadmkc ? await getKecamatanId(properties.wadmkc) : null,
                    desa_id: properties.wadmkd ? await getDesaId(properties.wadmkd) : null,
                    sketsa: properties.sketsa,
                    docpendukung: properties.docpendukung,
                    status: properties.status === 'Proses' ? 0 : 1,
                    verifiedat: properties.status !== 'Proses' ? properties.tglsurvei || new Date().toISOString() : null,
                    createdAt: properties.tglsurvei,
                    updatedAt: properties.tglsurvei,
                };
    
                const DataToponimsave = await Datatoponim.create(newDatatoponim);
    
                // Handle Foto Toponim
                for (let i = 1; i <= 4; i++) {
                    const fotoUrl = properties[`foto${i}`];
                    if (fotoUrl) {
                        const newFotoToponim = {
                            datatoponim_id: DataToponimsave.id,
                            foto_url: fotoUrl,
                        };
                        await Fototoponim.create(newFotoToponim);
                    }
                }
    
                // Handle Detail Toponim
                const newDetailtoponim = {
                    datatoponim_id: DataToponimsave.id,
                    zona_utm: properties.zonautm,
                    klstpn: properties.klstpn,
                    id_unsur: properties.id_unsur,
                    createdAt: properties.tglsurvei,
                    updatedAt: properties.tglsurvei,
                };
    
                await Detailtoponim.create(newDetailtoponim);
            });
    
            // Wait for all promises to finish
            await Promise.all(promises);
    
            res.status(201).json({ message: 'Import successful!' });
        } catch (error) {
            console.error('Error importing data: ', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    importCsv: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
    
            const results = [];
            const readable = new Readable();
            readable.push(req.file.buffer);
            readable.push(null);
    
            readable
                .pipe(csv())
                .on('data', (data) => {
                    results.push(data);
                })
                .on('end', async () => {
                    // Proses data untuk menyimpannya ke database
                    for (const properties of results) {
                        const newDatatoponim = {
                            statpub: checkEmpty(properties['Status Publikasi']) ?? null,
                            statpem: checkEmpty(properties['Status Pembakuan']) ?? null,
                            status: properties['Status Data'] === 'Proses' ? 0 : 1,
                            id_toponim: checkEmpty(properties['Id Toponim']) ?? null,
                            unsur_id: await getUnsurId(properties['Unsur']) ?? null,
                            nama_lokal: checkEmpty(properties['Nama Lokal']) ?? null,
                            nama_spesifik: checkEmpty(properties['Nama Spesifik']) ?? null,
                            kecamatan_id: properties['Kecamatan'] ? await getKecamatanId(properties['Kecamatan']) : null,
                            desa_id: properties['Desa / Kelurahan'] ? await getDesaId(properties['Desa / Kelurahan']) : null,
                            nama_surveyor: properties['Nama Surveyor'] ?? null,
                            narasumber: properties['Narasumber'] ?? null,
                            verifiedat: properties['Status Data'] !== 'Proses' ? properties['Tanggal Survei'] || new Date().toISOString() : null, 
                        };
    
                        // Simpan data toponim ke database
                        let DataToponimsave = await Datatoponim.create(newDatatoponim);
    
                        // Simpan foto jika ada
                        const fotoUrls = [
                            checkEmpty(properties['foto1']),
                            checkEmpty(properties['foto2']),
                            checkEmpty(properties['foto3']),
                            checkEmpty(properties['foto4']),
                        ];
                        for (const fotoUrl of fotoUrls) {
                            if (fotoUrl) {
                                const newFotoToponim = {
                                    datatoponim_id: DataToponimsave.id,
                                    foto_url: fotoUrl,
                                };
                                await Fototoponim.create(newFotoToponim);
                            }
                        }
    
                        // Simpan detail toponim
                        const newDetailtoponim = {
                            datatoponim_id: DataToponimsave.id,
                            zona_utm: checkEmpty(properties['Zona UTM']) ?? null,
                            nlp: checkEmpty(properties['NLP']) ?? null,
                            nama_lain: checkEmpty(properties['Nama Lain']) ?? null,
                            asal_bahasa: checkEmpty(properties['Asal Bahasa']) ?? null,
                            arti_nama: checkEmpty(properties['Arti Nama']) ?? null,
                            sejarah_nama: checkEmpty(properties['Sejarah Nama']) ?? null,
                            nama_sebelumnya: checkEmpty(properties['Nama Sebelumnya']) ?? null,
                            nama_rekomendasi: checkEmpty(properties['Nama Rekomendasi']) ?? null,
                            ucapan: checkEmpty(properties['Ucapan']) ?? null,
                            ejaan: checkEmpty(properties['Ejaan']) ?? null,
                            nilai_ketinggian: checkEmpty(properties['Nilai Ketinggian']) ?? null,
                            akurasi: checkEmpty(properties['Akurasi']) ?? null,
                            narasumber: checkEmpty(properties['Narasumber']) ?? null,
                            sumber_data: checkEmpty(properties['Sumber Data']) ?? null,
                            createdAt: checkEmpty(properties['Tanggal Survei']) ?? null,
                            updatedAt: checkEmpty(properties['Tanggal Survei']) ?? null,
                            catatan: checkEmpty(properties['Catatan']) ?? null,
                        };
    
                        await Detailtoponim.create(newDetailtoponim);
                    }
    
                    res.status(201).json({ message: 'Import successful!' });
                });
        } catch (error) {
            console.error('Error importing data: ', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}