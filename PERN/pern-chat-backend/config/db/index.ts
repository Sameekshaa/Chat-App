import knexfile from "../knexfile";
import { knex } from "knex";
const knexInstance = knex(knexfile);

/**
 * multiple export es6 way
 */
export { knexInstance as knex };
// module.exports = { knex };

/**
 * default export es6 way
 */
export default knexInstance;
// export {};
