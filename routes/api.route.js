//main
const datatoponimRoute = require('./main/datatoponim.route');
const detailtoponimRoute = require('./main/detailtoponim.route');
const fototoponimRoute = require('./main/fototoponim.route');

//master
const contactRoute = require('./master/contact.route');
const desaRoute = require('./master/desa.route');
const kecamatanRoute = require('./master/kecamatan.route');
const klasifikasiRoute = require('./master/klasifikasi.route');
const manualbookRoute = require('./master/manualbook.route');
const mapslampuraRoute = require('./master/mapslampura.route');
const unsurRoute = require('./master/unsur.route');
const userRoute = require('./master/user.route');
const userinfoRoute = require('./master/userinfo.route');
const roleRoute = require('./master/role.route');
const permissionRoute = require('./master/permission.route');

module.exports = function (app, urlApi) {
    //main
    app.use(urlApi, datatoponimRoute);
    app.use(urlApi, detailtoponimRoute);
    app.use(urlApi, fototoponimRoute);

    //master
    app.use(urlApi, contactRoute);
    app.use(urlApi, desaRoute);
    app.use(urlApi, kecamatanRoute);
    app.use(urlApi, klasifikasiRoute);
    app.use(urlApi, manualbookRoute);
    app.use(urlApi, mapslampuraRoute);
    app.use(urlApi, unsurRoute);
    app.use(urlApi, userRoute);
    app.use(urlApi, userinfoRoute);
    app.use(urlApi, roleRoute);
    app.use(urlApi, permissionRoute);
}