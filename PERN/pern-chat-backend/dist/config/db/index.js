"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knex = void 0;
const knexfile = require("../knexfile");
const knex = require("knex")(knexfile);
exports.knex = knex;
// module.exports = { knex };
/**
 * Learn Typescript: default export es6 way
 */
exports.default = knex;
// export {};
//# sourceMappingURL=index.js.map