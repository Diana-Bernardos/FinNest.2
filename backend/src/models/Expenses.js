const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Expenses = sequelize.define('Expenses', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El monto del gasto debe ser mayor que 0'
      },
      isNumeric: {
        msg: 'El monto debe ser un número válido'
      }
    }
  },
  category: {
    type: DataTypes.ENUM(
      'alimentación', 
      'transporte', 
      'vivienda', 
      'servicios', 
      'educación', 
      'entretenimiento', 
      'salud', 
      'otros'
    ),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'La descripción no puede exceder 500 caracteres'
      }
    }
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      },
      isNotFuture(value) {
        if (new Date(value) > new Date()) {
          throw new Error('La fecha del gasto no puede ser en el futuro');
        }
      }
    }
  }
}, {
  tableName: 'expenses',
  timestamps: true,
  paranoid: true,
  hooks: {
    beforeValidate: (expense) => {
      // Normalizar la categoría
      if (expense.category) {
        expense.category = expense.category.toLowerCase().trim();
      }
    }
  }
});

// Método de utilidad fuera del modelo (compatible con MySQL)
Expenses.getExpensesByCategory = async (year, month) => {
  try {
    const query = `
      SELECT 
        category, 
        SUM(amount) as total, 
        COUNT(*) as count
      FROM expenses
      WHERE 
        YEAR(date) = :year
        ${month ? 'AND MONTH(date) = :month' : ''}
      GROUP BY category
      ORDER BY total DESC
    `;

    const [results] = await sequelize.query(query, {
      replacements: { year, month },
      type: sequelize.QueryTypes.SELECT
    });

    return results;
  } catch (error) {
    console.error('Error al obtener gastos por categoría:', error);
    throw error;
  }
};

// Método para categorizar gastos
Expenses.categorizeExpense = (amount) => {
  if (amount < 10000) return 'bajo';
  if (amount < 50000) return 'medio';
  return 'alto';
};

module.exports = Expenses;