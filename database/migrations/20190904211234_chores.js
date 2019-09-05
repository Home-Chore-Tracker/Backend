exports.up = function(knex) {
  return knex.schema.createTable('chores', table => {
    table.increments();
    table
      .integer('child_id')
      .unsigned()
      .notNullable()
      .references('children.id');
    table.string('title').notNullable();
    table.date('duedate');
    table.boolean('complete').defaultTo(false);
    table.string('description');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('chores');
};
