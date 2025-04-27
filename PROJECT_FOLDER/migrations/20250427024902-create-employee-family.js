'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeFamilies', {
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
      name: {
        type: Sequelize.STRING(255)
      },
      identifier: {
        type: Sequelize.STRING(255)
      },
      job: {
        type: Sequelize.STRING(255)
      },
      place_of_birth: {
        type: Sequelize.STRING(255)
      },
      date_of_birth: {
        type: Sequelize.DATEONLY
      },
      religion: {
        allowNull: false,
        type: Sequelize.ENUM('Islam','Katolik','Budha','Protestas','Konghucu'),
        defaultValue: 'Islam'
      },
      is_life: {
        type: Sequelize.BOOLEAN,
        defaultValue:true
      },
      is_divorced: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      relation_status: {
        allowNull: false,
        type: Sequelize.ENUM('Suami','Istri','Anak','Anak Sambung'),
        defaultValue: 'Suami'
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

    await queryInterface.addIndex('EmployeeFamilies', ['employee_id'])
    await queryInterface.addIndex('EmployeeFamilies', ['name'])
    await queryInterface.addIndex('EmployeeFamilies', ['identifier'])
    await queryInterface.addIndex('EmployeeFamilies', ['religion'])
    await queryInterface.addIndex('EmployeeFamilies', ['is_life'])
    await queryInterface.addIndex('EmployeeFamilies', ['relation_status'])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('EmployeeFamilies', ['employee_id'])
    await queryInterface.removeIndex('EmployeeFamilies', ['name'])
    await queryInterface.removeIndex('EmployeeFamilies', ['identifier'])
    await queryInterface.removeIndex('EmployeeFamilies', ['religion'])
    await queryInterface.removeIndex('EmployeeFamilies', ['is_life'])
    await queryInterface.removeIndex('EmployeeFamilies', ['relation_status'])
    await queryInterface.dropTable('EmployeeFamilies');
  }
};