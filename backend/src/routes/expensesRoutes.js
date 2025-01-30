// src/routes/expensesRoutes.js
const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const Expenses = require('../models/Expenses');
const { Op } = require('sequelize');

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

// Categorías válidas
const VALID_CATEGORIES = [
  'alimentación', 'transporte', 'vivienda', 'servicios', 
  'educación', 'entretenimiento', 'salud', 'otros'
];

// Obtener todos los gastos
router.get('/', 
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número entero mayor a 0'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe ser un número entre 1 y 100'),
    query('category').optional().isIn(VALID_CATEGORIES).withMessage('Categoría inválida'),
    query('startDate').optional().isISO8601().withMessage('Fecha de inicio inválida'),
    query('endDate').optional().isISO8601().withMessage('Fecha de fin inválida')
  ]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { category, startDate, endDate } = req.query;

      // Construir condiciones de filtro
      const whereCondition = {};
      
      if (category) {
        whereCondition.category = category;
      }

      if (startDate && endDate) {
        whereCondition.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      } else if (startDate) {
        whereCondition.date = {
          [Op.gte]: new Date(startDate)
        };
      } else if (endDate) {
        whereCondition.date = {
          [Op.lte]: new Date(endDate)
        };
      }

      const { count, rows } = await Expenses.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [['date', 'DESC']]
      });

      res.json({
        total: count,
        page,
        limit,
        expenses: rows
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener gastos', error: error.message });
    }
  }
);

// Obtener un gasto por ID
router.get('/:id', 
  validate([
    param('id').isUUID().withMessage('ID de gasto inválido')
  ]),
  async (req, res) => {
    try {
      const expense = await Expenses.findByPk(req.params.id);
      
      if (!expense) {
        return res.status(404).json({ message: 'Gasto no encontrado' });
      }

      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener gasto', error: error.message });
    }
  }
);

// Crear nuevo gasto
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    // Validar los datos recibidos
    if (!amount || !category) {
      return res.status(400).json({
        message: 'El monto y la categoría son requeridos'
      });
    }

    // Crear el nuevo gasto
    const newExpense = await Expenses.create({
      amount,
      category,
      description: description || null,
      date: date || new Date()
    });

    // Responder con el gasto creado
    res.status(201).json({
      message: 'Gasto creado exitosamente',
      expense: newExpense
    });

  } catch (error) {
    console.error('Error al crear gasto:', error);
    res.status(500).json({
      message: 'Error al crear el gasto',
      error: error.message
    });
  }
});
// Actualizar gasto
router.put('/:id', 
  validate([
    param('id').isUUID().withMessage('ID de gasto inválido'),
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Monto debe ser un número positivo'),
    body('category').optional().isIn(VALID_CATEGORIES).withMessage('Categoría inválida'),
    body('description').optional().isString().withMessage('Descripción debe ser texto'),
    body('date').optional().isISO8601().toDate().withMessage('Fecha inválida')
  ]),
  async (req, res) => {
    try {
      const [updated] = await Expenses.update(req.body, {
        where: { id: req.params.id }
      });

      if (updated) {
        const updatedExpense = await Expenses.findByPk(req.params.id);
        res.json(updatedExpense);
      } else {
        res.status(404).json({ message: 'Gasto no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar gasto', error: error.message });
    }
  }
);

// Eliminar gasto
router.delete('/:id', 
  validate([
    param('id').isUUID().withMessage('ID de gasto inválido')
  ]),
  async (req, res) => {
    try {
      const deleted = await Expenses.destroy({
        where: { id: req.params.id }
      });

      if (deleted) {
        res.json({ message: 'Gasto eliminado correctamente' });
      } else {
        res.status(404).json({ message: 'Gasto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar gasto', error: error.message });
    }
  }
);

// Endpoint de análisis: Gastos por categoría
router.get('/analysis/by-category', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const categoryAnalysis = await Expenses.findAll({
      attributes: [
        'category',
        [Expenses.sequelize.fn('SUM', Expenses.sequelize.col('amount')), 'total_amount'],
        [Expenses.sequelize.fn('COUNT', Expenses.sequelize.col('id')), 'transaction_count']
      ],
      where: Expenses.sequelize.where(
        Expenses.sequelize.fn('YEAR', Expenses.sequelize.col('date')),
        currentYear
      ),
      group: ['category'],
      order: [[Expenses.sequelize.col('total_amount'), 'DESC']]
    });

    res.json(categoryAnalysis);
  } catch (error) {
    res.status(500).json({ message: 'Error en análisis de categorías', error: error.message });
  }
});

module.exports = router;