# Sipeta-BE

## Cara Menjalankan Aplikasi

Untuk menjalankan aplikasi, ikuti langkah-langkah berikut:

0. Simple running 
    ```bash
    npm install
    npx sequelize-cli db:migrate:undo:all
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    npm start
    ```

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Rollback semua migration**:
    ```bash
    npx sequelize-cli db:migrate:undo:all
    ```

3. **Jalankan migration**:
    ```bash
    npx sequelize-cli db:migrate
    ```

4. **Jalankan seeder**:
    ```bash
    npx sequelize-cli db:seed:all
    ```

5. **Jalankan aplikasi**:
    ```bash
    npm start
    ```

## Tambahan Perintah Sequelize

1. **Generate Seeder**:
    Untuk membuat seeder baru, gunakan perintah berikut:
    ```bash
    npx sequelize-cli seed:generate --name demo-user
    ```

2. **Jalankan Seeder Spesifik**:
    Untuk menjalankan seeder tertentu, gunakan perintah berikut:
    ```bash
    npx sequelize-cli db:seed --seed <name_of_seeder_file>
    ```

## Generate Ulang Data dengan Seeder

Jika ingin mengulang proses migrasi dan seeding (misalnya untuk reset data), gunakan perintah berikut:

1. **Rollback semua migration**:
    ```bash
    npx sequelize-cli db:migrate:undo:all
    ```

2. **Jalankan migration kembali**:
    ```bash
    npx sequelize-cli db:migrate
    ```

3. **Jalankan seeder kembali**:
    ```bash
    npx sequelize-cli db:seed:all
    ```

## Backup Hard Delete

Jika terjadi error saat menghapus data karena keterkaitan dengan tabel lain (foreign key constraint), gunakan logika berikut untuk menanganinya:

```javascript
if (err.name === 'SequelizeForeignKeyConstraintError') {
    res.status(400).json(response(400, 'Data tidak bisa dihapus karena masih digunakan pada tabel lain'));
} else {
    res.status(500).json(response(500, 'Internal server error', err));
    console.log(err);
}
