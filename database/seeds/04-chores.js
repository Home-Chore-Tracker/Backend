
exports.seed = function (knex) {
  return knex('chores').insert([
    {
      id: 1,
      title: 'Take out the trash',
      description: null,
      completed: false,
      duedate: '2019-09-01',
      child_id: 1
    },
    {
      id: 2,
      title: 'Pick up the poop',
      description: 'Poop from both the front- and back-yards.',
      completed: false,
      duedate: '2019-09-01',
      child_id: 2
    },
    {
      id: 3,
      title: 'Walk the dogs',
      description: null,
      completed: false,
      duedate: '2019-09-01',
      child_id: 3
    },
    {
      id: 4,
      title: 'Put the clean dishes away',
      description: null,
      completed: true,
      duedate: '2019-09-01',
      child_id: 3
    },
  ]);
};
