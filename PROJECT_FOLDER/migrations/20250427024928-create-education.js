'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Educations', {
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
      level: {
        type: Sequelize.ENUM(['TK','SD','SMP','SMA','Strata 1','Strata 2','Doktor','Profesor']),
        defaultValue:'SMA'
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(255)
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

    await queryInterface.addIndex('Educations', ['employee_id'])
    await queryInterface.addIndex('Educations', ['name'])
    await queryInterface.addIndex('Educations', ['level'])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Educations', ['employee_id'])
    await queryInterface.removeIndex('Educations', ['name'])
    await queryInterface.removeIndex('Educations', ['level'])
    await queryInterface.dropTable('Educations');
  }
};