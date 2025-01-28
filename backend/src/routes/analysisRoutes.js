// src/routes/analysisRoutes.js
const express = require('express');
const analysisRouter = express.Router();

const { sequelize } = require('../config/database');
const Expenses = require('../models/Expenses');
const Savings = require('../models/Savings');

analysisRouter.get('/monthly-summary', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const monthlyExpenses = await sequelize.query(
      `SELECT 
        MONTH(date) as month, 
        SUM(amount) as total_expenses,
        COUNT(*) as transaction_count
      FROM expenses
      WHERE YEAR(date) = :year
      GROUP BY MONTH(date)
      ORDER BY month`,
      {
        replacements: { year: currentYear },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const monthlySavings = await sequelize.query(
      `SELECT 
        MONTH(targetDate) as month, 
        SUM(currentAmount) as total_savings,
        COUNT(*) as savings_count
      FROM savings
      WHERE YEAR(targetDate) = :year
      GROUP BY MONTH(targetDate)
      ORDER BY month`,
      {
        replacements: { year: currentYear },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json({
      monthlyExpenses,
      monthlySavings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en análisis mensual', error: error.message });
  }
});

module.exports = analysisRouter;