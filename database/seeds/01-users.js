
exports.seed = function(knex) {
  return knex('users').insert([
    {
      id: 1,
      name: 'testuser',
      email: 'testuser@example.com',
      password: '$2a$10$GO/CIkLWX153JsDVw9nom.F41OGx7BGnfXv36Tjzot3zN12QpuPvK'
    },
  ]);
};
