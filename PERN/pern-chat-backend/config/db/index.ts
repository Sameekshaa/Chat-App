const knexfile = require("../knexfile");

const knex: any = require("knex")(knexfile);

/**
 * Learn TypeScript: multiple export es6 way
 */
export { knex };
// module.exports = { knex };

/**
 * Learn Typescript: default export es6 way
 */
export default knex;
// export {};
