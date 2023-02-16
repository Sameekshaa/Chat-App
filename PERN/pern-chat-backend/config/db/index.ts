const knexfile = require("../knexfile");

const knex: any = require("knex")(knexfile);

/**
 * multiple export es6 way
 */
export { knex };
// module.exports = { knex };

/**
 * default export es6 way
 */
export default knex;
// export {};
