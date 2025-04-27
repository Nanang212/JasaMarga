const express = require('express');
const router = express.Router();

const EmployeeProfileController = require('../controllers/employeeProfileController');

// Routes
router.get('/', EmployeeProfileController.all);
router.get('/:id', EmployeeProfileController.detail);
router.post('/', EmployeeProfileController.createValidation, EmployeeProfileController.create);
router.put('/:id', EmployeeProfileController.updateValidation, EmployeeProfileController.update);
router.delete('/:id', EmployeeProfileController.deleteValidation, EmployeeProfileController.delete);

module.exports = router;
