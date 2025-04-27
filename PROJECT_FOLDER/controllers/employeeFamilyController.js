const { EmployeeFamily, Employee } = require('../models');
const { validationResult, body, param } = require('express-validator');
const { Op } = require('sequelize');
const messages = require('../config/message');

class EmployeeFamilyController {

  // === Validators ===

  static createValidation = [
    body('employee_id').isInt().custom(async (item) => {
      const isExists = await Employee.findOne({ where: { id: item } });
      if (!isExists) {
        throw new Error(messages.EMPLOYEE.NOT_FOUND);
      }
      return true;
    }),
    body('name').isString().isLength({ max: 191 }),
    body('identifier').isString().isLength({ max: 20 }).custom(async (item) => {
      const isExists = await EmployeeFamily.findOne({ where: { identifier: item } });
      if (isExists) {
        throw new Error(messages.GENERAL.UNIQUE);
      }
      return true;
    }),
    body('job').isString().isLength({ max: 191 }),
    body('place_of_birth').isString().isLength({ max: 191 }),
    body('date_of_birth').isDate(),
    body('religion').isIn(['Islam', 'Katolik', 'Budha', 'Protestas', 'Konghucu']),
    body('is_life').isBoolean(),
    body('is_divorced').isBoolean(),
    body('relation_status').isIn(['Suami', 'Istri', 'Anak', 'Anak Sambung']),
    body('created_by').isString().isLength({ max: 191 }),
    body('updated_by').isString().isLength({ max: 191 }),
  ];

  static updateValidation = [
    param('id').isInt().custom(async (item) => {
      const isExists = await EmployeeFamily.findOne({ where: { id: item } });
      if (!isExists) {
        throw new Error(messages.EMPLOYEE_FAMILY.NOT_FOUND);
      }
      return true;
    }),
    body('employee_id').optional().isInt().custom(async (item) => {
      const isExists = await Employee.findOne({ where: { id: item } });
      if (!isExists) {
        throw new Error(messages.EMPLOYEE.NOT_FOUND);
      }
      return true;
    }),
    body('name').optional().isString().isLength({ max: 191 }),
    body('identifier').optional().isString().isLength({ max: 20 }).custom(async (item) => {
      const isExists = await EmployeeFamily.findOne({ where: { identifier: item } });
      if (isExists) {
        throw new Error(messages.GENERAL.UNIQUE);
      }
      return true;
    }),
    body('job').optional().isString().isLength({ max: 191 }),
    body('place_of_birth').optional().isString().isLength({ max: 191 }),
    body('date_of_birth').optional().isDate(),
    body('religion').optional().isIn(['Islam', 'Katolik', 'Budha', 'Protestas', 'Konghucu']),
    body('is_life').optional().isBoolean(),
    body('is_divorced').optional().isBoolean(),
    body('relation_status').optional().isIn(['Suami', 'Istri', 'Anak', 'Anak Sambung']),
    body('created_by').optional().isString().isLength({ max: 191 }),
    body('updated_by').optional().isString().isLength({ max: 191 }),
  ];

  static deleteValidation = [
    param('id').isInt().custom(async (item) => {
      const isExists = await EmployeeFamily.findOne({ where: { id: item } });
      if (!isExists) {
        throw new Error(messages.EMPLOYEE_FAMILY.NOT_FOUND);
      }
      return true;
    })
  ];

  // === Handlers ===

  static async all(req, res) {
    try {
      const query = {};
      query.where = {};

      if (req.query.id) {
        query.where.id = {
          [Op.in]: req.query.id.split(',').map(id => parseInt(id))
        };
      }

      query.order = [['created_at', 'DESC']];
      if (req.query.orderBy) {
        query.order = [[req.query.orderBy, req.query.orderType]];
      }

      if (req.query.page < 1) req.query.page = 1;
      query.limit = req.query.limit ? parseInt(req.query.limit) : 10;
      query.offset = req.query.page ? (parseInt(req.query.page) - 1) * query.limit : 0;

      query.include = [
        { model: Employee, as: 'employee', required: false }
      ];

      const datas = await EmployeeFamily.findAll(query);
      return res.status(200).json({ status: 'success', data: datas });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.GENERAL.FAILED });
    }
  }

  static async detail(req, res) {
    try {
      const data = await EmployeeFamily.findOne({
        where: { id: req.params.id },
        include: [{ model: Employee, as: 'employee', required: false }]
      });

      if (!data) {
        return res.status(404).json({ status: 'error', message: messages.EMPLOYEE_FAMILY.NOT_FOUND });
      }

      return res.status(200).json({ status: 'success', data: data });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.GENERAL.FAILED });
    }
  }

  static async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: 'error', message: errorMessages });
    }

    const t = await EmployeeFamily.sequelize.transaction();
    try {
      const data = await EmployeeFamily.create(req.body, { transaction: t });
      await t.commit();
      return res.status(201).json({ status: 'success', data: data });

    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.EMPLOYEE_FAMILY.CREATE_FAILED });
    }
  }

  static async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: 'error', message: errorMessages });
    }

    const t = await EmployeeFamily.sequelize.transaction();
    try {
      const family = await EmployeeFamily.findByPk(req.params.id);
      if (!family) {
        return res.status(404).json({ status: 'error', message: messages.EMPLOYEE_FAMILY.NOT_FOUND });
      }

      await family.update(req.body, { transaction: t });
      await t.commit();
      return res.status(200).json({ status: 'success', data: family });

    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.EMPLOYEE_FAMILY.UPDATE_FAILED });
    }
  }

  static async delete(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: 'error', message: errorMessages });
    }

    const t = await EmployeeFamily.sequelize.transaction();
    try {
      const family = await EmployeeFamily.findByPk(req.params.id);
      if (!family) {
        return res.status(404).json({ status: 'error', message: messages.EMPLOYEE_FAMILY.NOT_FOUND });
      }

      await family.destroy({ transaction: t });
      await t.commit();
      return res.status(200).json({ status: 'success', message: 'Family deleted successfully' });

    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.EMPLOYEE_FAMILY.DELETE_FAILED });
    }
  }
}

module.exports = EmployeeFamilyController;
