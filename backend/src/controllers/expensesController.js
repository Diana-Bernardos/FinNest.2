// src/controllers/expensesController.js
const Expenses = require('../models/Expenses');
const { Op } = require('sequelize');

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expenses.findAll(); // Asegúrate de usar el modelo correcto
    console.log('Gastos obtenidos:', expenses); // Verifica los datos aquí
    if (!Array.isArray(expenses)) {
      return res.status(500).json({ message: 'Error: Los datos no son un array' });
    }
    res.json({ expenses }); // Envía los datos como objeto con clave "expenses"
  } catch (error) {
    console.error('Error obteniendo gastos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { 
      id,
      amount, 
      category, 
      description, 
      date 
    } = req.body;

    const newExpense = await Expenses.create({
      id,
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