'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EmployeeFamilies', null, {});
    await queryInterface.bulkInsert('EmployeeFamilies', [
      {
        id: 1,
        employee_id: 1,
        name: 'Marni',
        identifier: '32100594109960002',
        job: 'Ibu Rumah Tangga',
        place_of_birth: 'Denpasar',
        date_of_birth: '1995-10-17',
        religion: 'Islam',
        is_life: true,
        is_divorced: false,
        relation_status: 'Istri',
        created_by: 'admin',
        updated_by: 'admin',
        created_at: '2022-12-12',
        updated_at: '2022-12-12',
      },
      {
        id: 2,
        employee_id: 1,
        name: 'Clara',
        identifier: '32100594109020004',
        job: 'Pelajar',
        place_of_birth: 'Bangkalan',
        date_of_birth: '2008-10-17',
        religion: 'Islam',
        is_life: true,
        is_divorced: false,
        relation_status: 'Anak',
        created_by: 'admin',
        updated_by: 'admin',
        created_at: '2022-12-12',
        updated_at: '2022-12-12',
      },
      {
        id: 3,
        employee_id: 1,
        name: 'Stephanie',
        identifier: '32100594109020005',
        job: 'Pelajar',
        place_of_birth: 'Bangkalan',
        date_of_birth: '2008-10-17',
        religion: 'Islam',
        is_life: true,
        is_divorced: false,
        relation_status: 'Anak',
        created_by: 'admin',
        updated_by: 'admin',
        created_at: '2022-12-12',
        updated_at: '2022-12-12',
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EmployeeFamilies', null, {});
  }
};
