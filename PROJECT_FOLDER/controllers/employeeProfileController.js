const { EmployeeProfile, Employee } = require('../models');
const { validationResult, body, param } = require('express-validator');
const { Op } = require('sequelize');
const messages = require('../config/message');

class EmployeeProfileController {

  // === Validators ===

  static createValidation = [
    body('employee_id').isInt().custom(async (item) => {
      const isExists = await Employee.findOne({ where: { id: item } });
      if (!isExists) {
        throw new Error(messages.EMPLOYEE.NOT_FOUND);
      }
      const profileExists = await EmployeeProfile.findOne({ where: { employee_id: item } });
      if (profileExists) {
        throw new Error(messages.GENERAL.UNIQUE);
      }
      return true;
    }),
    body('place_of_birth').isString().isLength({ max: 191 }),
    body('date_of_birth').isDate(),
    body('is_married').isBoolean(),
    body('prof_pict').optional().isString().isLength({ max: 191 }),
    body('gender').isIn(['Laki-Laki', 'Perempuan']),
    body('created_by').isString().isLength({ max: 191 }),
    body('updated_by').isString().isLength({ max: 191 }),
  ];

  static updateValidation = [
    param('id').isInt().custom(async (item) => {
      const isExists = await EmployeeProfile.findOne({ where: { id: item } });
      if (!isExists) {
        throw new Error(messages.EMPLOYEE_PROFILE.NOT_FOUND);
      }
      return true;
    }),
    body('employee_id').optional().isInt().custom(async (item) => {
      const isExists = await Employee.findOne({ where: { id: item } });
      if (!isExists) {
        throw new Error(messages.EMPLOYEE.NOT_FOUND);
      }
      const profileExists = await EmployeeProfile.findOne({ where: { employee_id: item } });
      if (profileExists) {
        throw new Error(messages.GENERAL.UNIQUE);
      }
      return true;
    }),
    body('place_of_birth').optional().isString().isLength({ max: 191 }),
    body('date_of_birth').optional().isDate(),
    body('is_married').optional().isBoolean(),
    body('prof_pict').optional().isString().isLength({ max: 191 }),
    body('gender').optional().isIn(['Laki-Laki', 'Perempuan']),
    body('created_by').optional().isString().isLength({ max: 191 }),
    body('updated_by').optional().isString().isLength({ max: 191 }),
  ];

  static deleteValidation = [
    param('id').isInt().custom(async (item) => {
      const isExists = await EmployeeProfile.findOne({ where: { id: item } });
      if (!isExists) {
        throw new Error(messages.EMPLOYEE_PROFILE.NOT_FOUND);
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

      const datas = await EmployeeProfile.findAll(query);
      return res.status(200).json({ status: 'success', data: datas });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.GENERAL.FAILED });
    }
  }

  static async detail(req, res) {
    try {
      const data = await EmployeeProfile.findOne({
        where: { id: req.params.id },
        include: [{ model: Employee, as: 'employee', required: false }]
      });

      if (!data) {
        return res.status(404).json({ status: 'error', message: messages.EMPLOYEE_PROFILE.NOT_FOUND });
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

    const t = await EmployeeProfile.sequelize.transaction();
    try {
      const data = await EmployeeProfile.create(req.body, { transaction: t });
      await t.commit();
      return res.status(201).json({ status: 'success', data: data });

    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.EMPLOYEE_PROFILE.CREATE_FAILED });
    }
  }

  static async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: 'error', message: errorMessages });
    }

    const t = await EmployeeProfile.sequelize.transaction();
    try {
      const profile = await EmployeeProfile.findByPk(req.params.id);
      if (!profile) {
        return res.status(404).json({ status: 'error', message: messages.EMPLOYEE_PROFILE.NOT_FOUND });
      }

      await profile.update(req.body, { transaction: t });
      await t.commit();
      return res.status(200).json({ status: 'success', data: profile });

    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.EMPLOYEE_PROFILE.UPDATE_FAILED });
    }
  }

  static async delete(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: 'error', message: errorMessages });
    }

    const t = await EmployeeProfile.sequelize.transaction();
    try {
      const profile = await EmployeeProfile.findByPk(req.params.id);
      if (!profile) {
        return res.status(404).json({ status: 'error', message: messages.EMPLOYEE_PROFILE.NOT_FOUND });
      }

      await profile.destroy({ transaction: t });
      await t.commit();
      return res.status(200).json({ status: 'success', message: 'Profile deleted successfully' });

    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.EMPLOYEE_PROFILE.DELETE_FAILED });
    }
  }
}

module.exports = EmployeeProfileController;
