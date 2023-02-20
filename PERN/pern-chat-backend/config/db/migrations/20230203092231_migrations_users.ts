/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex: any) {
  return knex.schema
    .createTable("users", (table: any) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("name").notNullable();
      table.string("email").notNullable().unique().index();
      table.string("password").notNullable();
      table.string("picture");
      table.json("newMessages").defaultTo("{}");
      table.string("status").defaultTo("online");
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"))
    .catch((error: any) => console.error(error))
    .finally(() => knex.destroy());
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex: any) {
  return knex.schema.dropTable("users");
};
