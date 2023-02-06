/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("name").notNullable();
      table.string("email").notNullable().unique().index();
      table.string("password").notNullable();
      table.string("picture");
      table.json("newMessages").defaultTo("{}");
      table.string("status").defaultTo("online");
      // table.boolean("isAdmin").defaultTo(false);
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
  return knex.schema.dropTable("users");
};
