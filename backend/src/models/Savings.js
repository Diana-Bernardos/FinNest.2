// src/models/Savings.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Savings extends Model {
  getProgress() {
    return this.current_amount ? (this.current_amount / this.target_amount * 100).toFixed(2) : 0;
  }

  getStatus() {
    const progress = this.getProgress();
    if (progress >= 100) return 'completado';
    
    const today = new Date();
    const targetDate = new Date(this.target_date);
    
    if (today > targetDate) return 'vencido';
    return 'en_progreso';
  }
}

Savings.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  goal_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del objetivo es requerido'
      }
    }
  },
  target_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El monto objetivo debe ser mayor que 0'
      }
    }
  },
  current_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'El monto actual no puede ser negativo'
      }
    }
  },
  target_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'La fecha objetivo debe ser válida'
      },
      isFuture(value) {
        if (new Date(value) <= new Date()) {
          throw new Error('La fecha objetivo debe ser en el futuro');
        }
      }
    }
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
  }
}, {
  sequelize,
  modelName: 'Savings',
  tableName: 'savings',
  timestamps: true,
  paranoid: true,
  underscored: true,
  hooks: {
    beforeValidate: (saving) => {
      if (saving.goal_name) {
        saving.goal_name = saving.goal_name.trim();
      }
      if (saving.description) {
        saving.description = saving.description.trim();
      }
    }
  }
});

module.exports = { Savings };