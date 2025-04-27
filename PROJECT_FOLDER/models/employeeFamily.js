// 'use strict';
// const {
//   Model
// } = require('sequelize');
// const employee = require('./employee');
// module.exports = (sequelize, DataTypes) => {
//   class employeeFamily extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of DataTypes lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//         employeeFamily.belongsTo(models.Employee, {
//             foreignKey: 'employee_id',
//             as: 'employee'
//         });
//     }
//   }
//   employeeFamily.init({
//     id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: DataTypes.INTEGER
//     },
//     employee_id: {
//         allowNull: false,
//         type: DataTypes.INTEGER,
//         references: {
//             model: employee,
//             key: 'id'
//         },
//         onDelete: 'CASCADE',
//     },
//     name: {
//         type: DataTypes.STRING(255)
//     },
//     identifier: {
//         type: DataTypes.STRING(255)
//     },
//     job: {
//         type: DataTypes.STRING(255)
//     },
//     place_of_birth: {
//         type: DataTypes.STRING(255)
//     },
//     date_of_birth: {
//         type: DataTypes.DATEONLY
//     },
//     religion: {
//         allowNull: false,
//         type: DataTypes.ENUM('Islam','Katolik','Budha','Protestas','Konghucu'),
//         defaultValue: 'Islam'
//     },
//     is_life: {
//         type: DataTypes.BOOLEAN,
//         defaultValue:true
//     },
//     is_divorced: {
//         type: DataTypes.BOOLEAN,
//         defaultValue:false
//     },
//     relation_status: {
//         allowNull: false,
//         type: DataTypes.ENUM('Suami','Istri','Anak','Anak Sambung'),
//         defaultValue: 'Suami'
//     },
//     created_by: {
//         type: DataTypes.STRING
//     },
//     updated_by: {
//         type: DataTypes.STRING
//     },
//     created_at: {
//         allowNull: false,
//         type: DataTypes.DATEONLY
//     },
//     updated_at: {
//         allowNull: false,
//         type: DataTypes.DATEONLY
//     }
//   }, {
//     sequelize,
//     modelName: 'employeeFamily',
//     tableName: 'EmployeeFamilies',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at'
//   });
//   return employeeFamily;
// };


'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeFamily extends Model {
    static associate(models) {
      EmployeeFamily.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee'
      });
    }
  }
  EmployeeFamily.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    employee_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Employees',  // <-- pakai string nama tabel
        key: 'id'
      },
      onDelete: 'CASCADE',
    },
    name: DataTypes.STRING(255),
    identifier: DataTypes.STRING(255),
    job: DataTypes.STRING(255),
    place_of_birth: DataTypes.STRING(255),
    date_of_birth: DataTypes.DATEONLY,
    religion: {
      allowNull: false,
      type: DataTypes.ENUM('Islam','Katolik','Budha','Protestas','Konghucu'),
      defaultValue: 'Islam'
    },
    is_life: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_divorced: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    relation_status: {
      allowNull: false,
      type: DataTypes.ENUM('Suami','Istri','Anak','Anak Sambung'),
      defaultValue: 'Suami'
    },
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATEONLY
    }
  }, {
    sequelize,
    modelName: 'EmployeeFamily',  // <-- PascalCase
    tableName: 'EmployeeFamilies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return EmployeeFamily;
};
