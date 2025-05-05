const { Education, Employee } = require('../models');
const { Op } = require('sequelize');
const { validationResult, body, param } = require('express-validator');
const messages = require('../config/message');
const { clearCache, getCache, setCache } = require("../utils/cache");

class EducationController {

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
    body('level').isIn(['TK', 'SD', 'SMP', 'SMA', 'Strata 1', 'Strata 2', 'Doktor', 'Profesor']),
    body('description').isString().isLength({ max: 255 }),
    body('created_by').isString().isLength({ max: 191 }),
    body('updated_by').isString().isLength({ max: 191 }),
  ];

  static updateValidation = [
    param('id').isInt(),
    body('employee_id').optional().isInt().custom(async (item) => {
      const isExists = await Employee.findOne({ where: { id: item } });
      if (!isExists) {
        throw new Error(messages.EMPLOYEE.NOT_FOUND);
      }
      return true;
    }),
    body('name').optional().isString().isLength({ max: 191 }),
    body('level').optional().isIn(['TK', 'SD', 'SMP', 'SMA', 'Strata 1', 'Strata 2', 'Doktor', 'Profesor']),
    body('description').optional().isString().isLength({ max: 255 }),
    body('created_by').optional().isString().isLength({ max: 191 }),
    body('updated_by').optional().isString().isLength({ max: 191 }),
  ];

  static deleteValidation = [
    param('id').isInt(),
  ];

  // === Handlers ===

  static async all(req, res) {
    try {
      const cacheKey = JSON.stringify(req.query); // Buat cacheKey berdasarkan query params
      const redisKey = `educations:list:${cacheKey}`;

      // 1. Cek apakah data ada di cache
      const cachedData = await getCache('educations', cacheKey);
      if (cachedData) {
        return res.status(200).json({
          status: "success (from cache)",
          data: cachedData,
        });
      }
      const query = { where: {} };

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

      const datas = await Education.findAll(query);
      return res.status(200).json({ status: 'success', data: datas });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.GENERAL.FAILED });
    }
  }

  static async detail(req, res) {
    try {
      const data = await Education.findOne({
        where: { id: req.params.id },
        include: [{ model: Employee, as: 'employee', required: false }]
      });

      if (!data) {
        return res.status(404).json({ status: 'error', message: messages.EDUCATION.NOT_FOUND });
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

    const t = await Education.sequelize.transaction();
    try {
      const data = await Education.create(req.body, { transaction: t });
      await t.commit();
      return res.status(201).json({ status: 'success', data: data });

    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.EDUCATION.CREATE_FAILED });
    }
  }

  static async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: 'error', message: errorMessages });
    }

    const t = await Education.sequelize.transaction();
    try {
      const education = await Education.findByPk(req.params.id);
      if (!education) {
        return res.status(404).json({ status: 'error', message: messages.EDUCATION.NOT_FOUND });
      }

      await education.update(req.body, { transaction: t });
      await t.commit();
      return res.status(200).json({ status: 'success', data: education });

    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.EDUCATION.UPDATE_FAILED });
    }
  }

  static async delete(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: 'error', message: errorMessages });
    }

    const t = await Education.sequelize.transaction();
    try {
      const education = await Education.findByPk(req.params.id);
      if (!education) {
        return res.status(404).json({ status: 'error', message: messages.EDUCATION.NOT_FOUND });
      }

      await education.destroy({ transaction: t });
      await t.commit();
      return res.status(200).json({ status: 'success', message: 'Education deleted successfully' });

    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ status: 'error', message: messages.EDUCATION.DELETE_FAILED });
    }
  }
}

module.exports = EducationController;
