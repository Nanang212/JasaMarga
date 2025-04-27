"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Employees", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nik: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue:true
      },
      start_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      end_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
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
    })
    await queryInterface.addIndex('Employees', ['nik'])
    await queryInterface.addIndex('Employees', ['name'])
    await queryInterface.addIndex('Employees', ['start_date'])
    await queryInterface.addIndex('Employees', ['end_date'])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Employees', ['nik'])
    await queryInterface.removeIndex('Employees', ['name'])
    await queryInterface.removeIndex('Employees', ['start_date'])
    await queryInterface.removeIndex('Employees', ['end_date'])
    await queryInterface.dropTable('Employees');
  }
};
