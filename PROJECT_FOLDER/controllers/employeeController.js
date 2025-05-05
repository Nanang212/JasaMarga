const {
  Employee,
  Education,
  EmployeeFamily,
  EmployeeProfile,
} = require("../models");
const { validationResult, body, param } = require("express-validator");
const { Op } = require("sequelize");
const messages = require("../config/message");
const redisClient = require("../config/redis");
const { clearCache, getCache, setCache } = require("../utils/cache");

class EmployeeController {
  // === Validators ===

  static createValidation = [
    body("nik")
      .isString()
      .isLength({ max: 50 })
      .custom(async (item) => {
        const isExists = await Employee.findOne({ where: { nik: item } });
        if (isExists) {
          throw new Error(messages.GENERAL.UNIQUE);
        }
        return true;
      }),
    body("name").isString().isLength({ max: 191 }),
    body("is_active").isBoolean(),
    body("start_date").isDate(),
    body("end_date").isDate(),
    body("created_by").isString().isLength({ max: 191 }),
    body("updated_by").isString().isLength({ max: 191 }),
  ];

  static updateValidation = [
    param("id")
      .isInt()
      .custom(async (item) => {
        const isExists = await Employee.findOne({ where: { id: item } });
        if (!isExists) {
          throw new Error(messages.EMPLOYEE.NOT_FOUND);
        }
        return true;
      }),
    body("nik")
      .optional()
      .isString()
      .isLength({ max: 50 })
      .custom(async (item) => {
        const isExists = await Employee.findOne({ where: { nik: item } });
        if (isExists) {
          throw new Error(messages.GENERAL.UNIQUE);
        }
        return true;
      }),
    body("name").optional().isString().isLength({ max: 191 }),
    body("is_active").optional().isBoolean(),
    body("start_date").optional().isDate(),
    body("end_date").optional().isDate(),
    body("created_by").optional().isString().isLength({ max: 191 }),
    body("updated_by").optional().isString().isLength({ max: 191 }),
  ];

  static deleteValidation = [
    param("id")
      .isInt()
      .custom(async (item) => {
        const isExists = await Employee.findOne({ where: { id: item } });
        if (!isExists) {
          throw new Error(messages.EMPLOYEE.NOT_FOUND);
        }
        return true;
      }),
  ];

  // === Handlers ===

  static async all(req, res) {
    try {
      const cacheKey = JSON.stringify(req.query); // Buat cacheKey berdasarkan query params
      const redisKey = `employees:list:${cacheKey}`;

      // 1. Cek apakah data ada di cache
      const cachedData = await getCache('employees', cacheKey);
      if (cachedData) {
        return res.status(200).json({
          status: "success (from cache)",
          data: cachedData,
        });
      }

      // 2. Build query dari request
      const query = { where: {} };

      if (req.query.id) {
        query.where.id = {
          [Op.in]: req.query.id.split(",").map((id) => parseInt(id)),
        };
      }

      if (req.query.name) {
        query.where.name = { [Op.iLike]: `%${req.query.name}%` };
      }

      if (req.query.is_active) {
        query.where.is_active = req.query.is_active;
      }

      if (req.query.limit !== "all") {
        if (req.query.page < 1) req.query.page = 1;
        query.limit = req.query.limit ? parseInt(req.query.limit) : 10;
        query.offset = req.query.page
          ? (parseInt(req.query.page) - 1) * query.limit
          : 0;
      }

      query.include = [
        { model: Education, as: "education", required: false },
        { model: EmployeeFamily, as: "families", required: false },
        { model: EmployeeProfile, as: "profile", required: false },
      ];

      // 3. Ambil data dari DB
      const employees = await Employee.findAll(query);
      await setCache('employees', cacheKey, employees, 120);
      return res.status(200).json({ status: "success", data: employees });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", message: messages.GENERAL.FAILED });
    }
  }

  static async detail(req, res) {
    try {
      const employee = await Employee.findOne({
        where: { id: req.params.id },
        include: [
          { model: Education, as: "education", required: false },
          { model: EmployeeFamily, as: "families", required: false },
          { model: EmployeeProfile, as: "profile", required: false },
        ],
      });

      if (!employee) {
        return res
          .status(404)
          .json({ status: "error", message: messages.EMPLOYEE.NOT_FOUND });
      }

      return res.status(200).json({ status: "success", data: employee });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", message: messages.GENERAL.FAILED });
    }
  }

  static async report(req, res) {
    try {
      const query = {
        include: [
          {
            model: EmployeeProfile,
            as: "profile",
            attributes: ["place_of_birth", "date_of_birth", "gender"],
            required: false,
          },
          {
            model: Education,
            as: "education", // alias tetap "education", meskipun ini array
            attributes: ["name", "level"],
            required: false,
          },
          {
            model: EmployeeFamily,
            as: "families",
            attributes: ["relation_status"],
            required: false,
          },
        ],
      };

      const employees = await Employee.findAll(query);

      const report = employees.map((employee) => {
        const profile = employee.profile;
        const educationList = employee.education || []; // education = array
        const education = educationList[0]; // ambil satu education pertama

        const families = employee.families || [];

        const age = profile
          ? new Date().getFullYear() -
            new Date(profile.date_of_birth).getFullYear()
          : null;
        const gender = profile ? profile.gender : null;

        const school_name = education ? education.name : null;
        const level = education ? education.level : null;

        const istriCount = families.filter(
          (f) => f.relation_status === "Istri"
        ).length;
        const anakCount = families.filter(
          (f) => f.relation_status === "Anak"
        ).length;

        let familyData = null;
        if (istriCount > 0 && anakCount > 0) {
          familyData = `${istriCount} Istri & ${anakCount} Anak`;
        } else if (istriCount > 0) {
          familyData = `${istriCount} Istri`;
        } else if (anakCount > 0) {
          familyData = `${anakCount} Anak`;
        }

        return {
          employee_id: employee.id,
          nik: employee.nik,
          name: employee.name,
          is_active: employee.is_active,
          gender: gender,
          age: age ? `${age} Years Old` : null,
          school_name: school_name,
          level: level,
          family_data: familyData,
        };
      });

      return res.status(200).json({ status: "success", data: report });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", message: messages.GENERAL.FAILED });
    }
  }

  static async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: "error", message: errorMessages });
    }

    const t = await Employee.sequelize.transaction();
    try {
      const employee = await Employee.create(req.body, { transaction: t });
      await t.commit();
      await clearCache('employees', 'list'); 
      return res.status(201).json({ status: "success", data: employee });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", message: messages.EMPLOYEE.CREATE_FAILED });
    }
  }

  static async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: "error", message: errorMessages });
    }

    const t = await Employee.sequelize.transaction();
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) {
        return res
          .status(404)
          .json({ status: "error", message: messages.EMPLOYEE.NOT_FOUND });
      }

      await employee.update(req.body, { transaction: t });
      await t.commit();
      await clearCache('employees', 'list'); 
      return res.status(200).json({ status: "success", data: employee });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", message: messages.EMPLOYEE.UPDATE_FAILED });
    }
  }

  static async delete(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => `${error.path} ${error.msg}`)[0];
      return res.status(406).json({ status: "error", message: errorMessages });
    }

    const t = await Employee.sequelize.transaction();
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) {
        return res
          .status(404)
          .json({ status: "error", message: messages.EMPLOYEE.NOT_FOUND });
      }

      await Education.destroy({
        where: { employee_id: employee.id },
        transaction: t,
      });
      await EmployeeFamily.destroy({
        where: { employee_id: employee.id },
        transaction: t,
      });
      await EmployeeProfile.destroy({
        where: { employee_id: employee.id },
        transaction: t,
      });
      await employee.destroy({ transaction: t });

      await t.commit();
      await clearCache('employees', 'list'); 
      return res
        .status(200)
        .json({ status: "success", message: "Employee deleted successfully" });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", message: messages.EMPLOYEE.DELETE_FAILED });
    }
  }
}

module.exports = EmployeeController;
