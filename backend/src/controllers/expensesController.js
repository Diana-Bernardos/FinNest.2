// src/controllers/expensesController.js
const Expenses = require('../models/Expenses');
const { Op } = require('sequelize');

exports.getAllExpenses = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      category 
    } = req.query;

    const whereCondition = {};

    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    if (category) {
      whereCondition.category = category;
    }

    const expenses = await Expenses.findAll({
      where: whereCondition,
      order: [['date', 'DESC']]
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error recuperando gastos', 
      error: error.message 
    });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { 
      amount, 
      category, 
      description, 
      date 
    } = req.body;

    const newExpense = await Expenses.create({
      amount,
      category,
      description,
      date: date || new Date()
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error registrando gasto', 
      error: error.message 
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      amount, 
      category, 
      description 
    } = req.body;

    const expense = await Expenses.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    await expense.update({
      amount, 
      category, 
      description
    });

    res.json(expense);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error actualizando gasto', 
      error: error.message 
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expenses.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    await expense.destroy();
    res.json({ message: 'Gasto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error eliminando gasto', 
      error: error.message 
    });
  }
};