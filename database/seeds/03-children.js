
exports.seed = function (knex) {
  return knex('children').insert([
    {
      id: 1,
      name: 'Bobby',
      family_id: 1,
      user_id: 1
    },
    {
      id: 2,
      name: 'Danny',
      family_id: 1,
      user_id: 1
    },
    {
      id: 3,
      name: 'Ceddy',
      family_id: 1,
      user_id: 1
    }
  ]);
};
