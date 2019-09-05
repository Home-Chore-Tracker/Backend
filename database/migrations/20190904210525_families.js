exports.up = function(knex) {
  return knex.schema.createTable('families', table => {
    table.increments();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('users.id');
    table.string('surname').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('families');
};
