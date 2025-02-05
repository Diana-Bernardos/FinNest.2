// src/routes/analysisRoutes.js
const express = require('express');
const analysisRouter = express.Router();

const { sequelize } = require('../config/database');
const Expenses = require('../models/Expenses');
const Savings = require('../models/Savings');

exports.getMonthlySummary = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;

    // Obtener gastos mensuales
    const monthlyExpenses = await Expenses.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpenses']
      ],
      where: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), currentMonth)
    });

    // Obtener ahorros totales
    const monthlySavings = await Savings.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('current_amount')), 'totalSavings']
      ]
    });

    // Obtener desglose por categoría
    const categorySummary = await Expenses.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      where: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), currentMonth),
      group: ['category']
    });

    // Construir respuesta JSON
    res.json({
      monthlyExpenses: monthlyExpenses[0]?.get('totalExpenses') || 0,
      monthlySavings: monthlySavings[0]?.get('totalSavings') || 0,
      categoryBreakdown: categorySummary.map(item => ({
        category: item.get('category'),
        totalAmount: item.get('totalAmount')
      }))
    });
  } catch (error) {
    console.error('Error obteniendo análisis mensual:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

module.exports = analysisRouter;