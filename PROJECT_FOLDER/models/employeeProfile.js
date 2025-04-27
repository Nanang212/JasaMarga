"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmployeeProfile extends Model {
    static associate(models) {
      EmployeeProfile.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee",
      });
    }
  }
  EmployeeProfile.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      employee_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Employees',  // <<< pakai nama tabel
          key: "id",
        },
        onDelete: "CASCADE",
      },
      place_of_birth: DataTypes.STRING(255),
      date_of_birth: DataTypes.DATEONLY,
      gender: {
        type: DataTypes.ENUM(["Laki-Laki", "Perempuan"]),
        defaultValue: "Laki-Laki",
      },
      is_married: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      prof_pict: {
        type: DataTypes.STRING(255),
        defaultValue: false,
      },
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      created_at: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
    },
    {
      sequelize,
      modelName: "EmployeeProfile",  // <<< PascalCase
      tableName: "EmployeeProfiles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return EmployeeProfile;
};
