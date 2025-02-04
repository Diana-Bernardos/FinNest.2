// src/models/Savings.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Savings extends Model {
  getProgress() {
    return this.currentAmount ? (this.currentAmount / this.targetAmount * 100).toFixed(2) : 0;
  }

  getStatus() {
    const progress = this.getProgress();
    if (progress >= 100) return 'completado';
    const today = new Date();
    const targetDate = new Date(this.targetDate);
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
        msg: 'El monto objetivo debe ser mayor a 0'
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
    type: DataTypes.DATEONLY,  // Cambiado a DATEONLY
    allowNull: false,
    validate: {
      isDate: true,
      isAfterToday(value) {
        if (new Date(value) <= new Date()) {
          throw new Error('La fecha objetivo debe ser posterior a hoy');
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'Savings',
  tableName: 'savings',
  timestamps: true,
  underscored: true,
  paranoid: true
});

module.exports = { Savings };