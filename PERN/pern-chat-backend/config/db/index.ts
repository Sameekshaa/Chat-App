const knexfile = require("../knexfile");

const knex:any = require("knex")(knexfile);

module.exports = { knex };

export {};