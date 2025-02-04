// src/routes/savingsRoutes.js
const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const { Savings } = require('../models/Savings');


// Middleware de validación
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
};

// Obtener todos los ahorros
router.get('/', async (req, res) => {
  try {
    const savings = await Savings.findAll({
      where: { deleted_at: null },
      order: [['created_at', 'DESC']]
    });

    res.json({
      status: 'success',
      savings: savings || []
    });
  } catch (error) {
    console.error('Error getting savings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los ahorros',
      error: error.message
    });
  }
});

// POST new saving
router.post('/', async (req, res) => {
  try {
    console.log('Received saving data:', req.body);

    const { goal_name, target_amount, current_amount, target_date } = req.body;

    // Validaciones
    if (!goal_name || !target_amount || !target_date) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan campos requeridos',
        details: {
          goal_name: !goal_name ? 'Nombre es requerido' : null,
          target_amount: !target_amount ? 'Monto objetivo es requerido' : null,
          target_date: !target_date ? 'Fecha objetivo es requerida' : null
        }
      });
    }

    // Validar tipos de datos
    if (isNaN(parseFloat(target_amount))) {
      return res.status(400).json({
        status: 'error',
        message: 'Monto objetivo inválido'
      });
    }

    // Validar fecha
    const parsedDate = new Date(target_date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Fecha inválida'
      });
    }

    // Crear el ahorro
    const newSaving = await Savings.create({
      goal_name: goal_name.trim(),
      target_amount: parseFloat(target_amount),
      current_amount: parseFloat(current_amount || 0),
      target_date: parsedDate
    });

    console.log('Created saving:', newSaving.toJSON());

    res.status(201).json({
      status: 'success',
      data: newSaving
    });

  } catch (error) {
    console.error('Error creating saving:', error);
    
    // Manejar errores específicos de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Error de validación',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    // Error general
    res.status(500).json({
      status: 'error',
      message: 'Error al crear el ahorro',
      error: error.message
    });
  }
});

// Actualizar ahorro
router.put('/:id', 
  validate([
    param('id').isUUID(),
    body('goalName').optional().notEmpty().trim(),
    body('targetAmount').optional().isFloat({ min: 0 }),
    body('currentAmount').optional().isFloat({ min: 0 }),
    body('targetDate').optional().isISO8601().toDate()
  ]),
  async (req, res) => {
    try {
      const updateData = {};
      if (req.body.goalName) updateData.goal_name = req.body.goalName;
      if (req.body.targetAmount) updateData.target_amount = req.body.targetAmount;
      if (req.body.currentAmount !== undefined) updateData.current_amount = req.body.currentAmount;
      if (req.body.targetDate) updateData.target_date = req.body.targetDate;

      const [updated] = await Savings.update(updateData, {
        where: { 
          id: req.params.id,
          deleted_at: null
        }
      });

      if (updated) {
        const updatedSaving = await Savings.findByPk(req.params.id);
        res.json(updatedSaving);
      } else {
        res.status(404).json({ message: 'Ahorro no encontrado' });
      }
    } catch (error) {
      console.error('Error en PUT /savings/:id:', error);
      res.status(400).json({ 
        message: 'Error al actualizar ahorro', 
        error: error.message 
      });
    }
  }
);

// Eliminar ahorro
router.delete('/:id', 
  validate([param('id').isUUID()]),
  async (req, res) => {
    try {
      const deleted = await Savings.destroy({
        where: { 
          id: req.params.id,
          deleted_at: null
        }
      });

      if (deleted) {
        res.json({ message: 'Ahorro eliminado correctamente' });
      } else {
        res.status(404).json({ message: 'Ahorro no encontrado' });
      }
    } catch (error) {
      console.error('Error en DELETE /savings/:id:', error);
      res.status(500).json({ 
        message: 'Error al eliminar ahorro', 
        error: error.message 
      });
    }
  }
);

module.exports = router;