
exports.seed = function (knex) {
  return knex('families').insert([
    {
      id: 1,
      surname: 'The Andersons',
      user_id: 1
    }
  ]);
};
