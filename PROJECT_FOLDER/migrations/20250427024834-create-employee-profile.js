'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      place_of_birth: {
        type: Sequelize.STRING(255)
      },
      date_of_birth: {
        type: Sequelize.DATEONLY
      },
      gender: {
        type: Sequelize.ENUM(['Laki-Laki', 'Perempuan']),
        defaultValue:'Laki-Laki'
      },
      is_married: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      prof_pict: {
        type: Sequelize.STRING(255),
        defaultValue:false
      },
      created_by: {
        type: Sequelize.STRING
      },
      updated_by: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATEONLY
      }
    });

    await queryInterface.addIndex('EmployeeProfiles', ['employee_id'])
    await queryInterface.addIndex('EmployeeProfiles', ['gender'])
    await queryInterface.addIndex('EmployeeProfiles', ['is_married'])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('EmployeeProfiles', ['employee_id'])
    await queryInterface.removeIndex('EmployeeProfiles', ['gender'])
    await queryInterface.removeIndex('EmployeeProfiles', ['is_married'])
    await queryInterface.dropTable('EmployeeProfiles');
  }
};