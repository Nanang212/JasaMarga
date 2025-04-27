"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', null, {});
    await queryInterface.bulkInsert("Employees", [
      {
        id: 1,
        nik: "11012",
        name: "Budi",
        is_active: true,
        start_date: "2022-12-12",
        end_date: "2029-12-12",
        created_by: "admin",
        updated_by: "admin",
        created_at:  '2022-12-12',
        updated_at: '2022-12-12',
      },
      {
        id: 2,
        nik: "11013",
        name: "Jarot",
        is_active: true,
        start_date: '2021-09-01',
        end_date: '2028-09-01',
        created_by: "admin",
        updated_by: "admin",
        created_at: '2022-12-12',
        updated_at: '2022-12-12',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Employees", null, {});
  },
};
