const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/employeeController');

// Routes
router.get('/', EmployeeController.all);
router.get('/report', EmployeeController.report);
router.get('/:id', EmployeeController.detail);
router.post('/', EmployeeController.createValidation, EmployeeController.create);
router.put('/:id', EmployeeController.updateValidation, EmployeeController.update);
router.delete('/:id', EmployeeController.deleteValidation, EmployeeController.delete);

module.exports = router;
