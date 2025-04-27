const express = require('express');
const router = express.Router();

const EmployeeFamilyController = require('../controllers/employeeFamilyController');

// Routes
router.get('/', EmployeeFamilyController.all);
router.get('/:id', EmployeeFamilyController.detail);
router.post('/', EmployeeFamilyController.createValidation, EmployeeFamilyController.create);
router.put('/:id', EmployeeFamilyController.updateValidation, EmployeeFamilyController.update);
router.delete('/:id', EmployeeFamilyController.deleteValidation, EmployeeFamilyController.delete);

module.exports = router;
