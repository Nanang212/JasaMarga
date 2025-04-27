// 'use strict';
// const {
//   Model
// } = require('sequelize');
// const employee = require('./employee');
// module.exports = (sequelize, DataTypes) => {
//   class Education extends Model {
//     static associate(models) {
//       Education.belongsTo(models.Employee, {
//         foreignKey: 'employee_id',
//         as: 'employee'
//       });
//     }
//   }
//   Education.init({
//     id: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER
//     },
//     employee_id: {
//       allowNull: false,
//       type: DataTypes.INTEGER,
//       references: {
//           model: employee,
//           key: 'id'
//       },
//       onDelete: 'CASCADE'
//     },
//     name: {
//       type: DataTypes.STRING
//     },
//     level: {
//       type: DataTypes.ENUM(['TK','SD','SMP','SMA','Strata 1','Strata 2','Doktor','Profesor']),
//       defaultValue:'SMA'
//     },
//     description: {
//       allowNull: false,
//       type: DataTypes.STRING
//     },
//     created_by: {
//       type: DataTypes.STRING
//     },
//     updated_by: {
//       type: DataTypes.STRING
//     },
//     created_at: {
//       allowNull: false,
//       type: DataTypes.DATE
//     },
//     updated_at: {
//       allowNull: false,
//       type: DataTypes.DATE
//     }
//   }, {
//     sequelize,
//     modelName: 'Education',
//     tableName: 'Educations',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at'
//   });
//   return Education;
// };


'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Education extends Model {
    static associate(models) {
      Education.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee'
      });
    }
  }

  Education.init({
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
        model: 'Employees',  // pakai string, bukan require model
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING
    },
    level: {
      type: DataTypes.ENUM(['TK','SD','SMP','SMA','Strata 1','Strata 2','Doktor','Profesor']),
      defaultValue: 'SMA'
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    created_by: {
      type: DataTypes.STRING
    },
    updated_by: {
      type: DataTypes.STRING
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Education',
    tableName: 'Educations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Education;
};
