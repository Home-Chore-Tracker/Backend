exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('name').notNullable();
    table
      .string('email')
      .unique()
      .notNullable();
    table.string('password').notNullable();
    table.string('jwt', 512);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
