'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Educations', null, {});
    await queryInterface.bulkInsert('Educations', [
      {
        id: 1,
        employee_id: 1,
        name: 'SMKN 7 Jakarta',
        level: 'SMA',
        description: 'Sekolah Menengah Atas',
        created_by: 'admin',
        updated_by: 'admin',
        created_at: '2022-12-12',
        updated_at: '2022-12-12'
      },
      {
        id: 2,
        employee_id: 2,
        name: 'Universitas Negeri Jakarta',
        level: 'Strata 1',
        description: 'Sarjana',
        created_by: 'admin',
        updated_by: 'admin',
        created_at: '2022-12-12',
        updated_at: '2022-12-12'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Educations', null, {});
  }
};
