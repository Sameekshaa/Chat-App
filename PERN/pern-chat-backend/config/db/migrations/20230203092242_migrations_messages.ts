/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex:any) {
  return knex.schema
    .createTable("messages", (table:any) => {
      table.increments("id").primary();
      table.text("content");
      table.uuid("from");
      table.string("time");
      table.string("date");
      table.string("to");
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"))
    .catch((error:any) => console.error(error))
    .finally(() => knex.destroy());
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex:any) {
  return knex.schema.dropTable("messages");
};
