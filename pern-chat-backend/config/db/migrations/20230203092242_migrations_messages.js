/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("messages", (table) => {
      table.increments("id").primary();
      table.text("content");
      table.uuid("from");
      table.string("time");
      table.string("date");
      table.string("to");
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"))
    .catch((error) => console.error(error))
    .finally(() => knex.destroy());
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("messages");
};
