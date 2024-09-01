const config = {
  development: {
    host: "65.21.238.170",
    database: "adminedw_cmr",
    username: "adminedw_admincmr",
    password: "Lorica2021+*",
    port: 3306,
    dialect: "mysql",
    logging: false,
  },
  production: {
    host: "5.161.124.16",
    database: "app_lice1_cmr",
    username: "app_lice1_admincmr",
    password: "Lorica2021+*",
    port: 3306,
    dialect: "mysql",
    logging: false,
    timezone: "-05:00"
  },
};

module.exports = { config };
