exports.up = function(knex) {
  return knex.schema.createTable('children', table => {
    table.increments();
    table
      .integer('family_id')
      .unsigned()
      .notNullable()
      .references('families.id');
    table.string('name').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('children');
};
