// src/models/Savings.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');


class Savings extends Model {
  // Método para calcular el progreso del ahorro
  calculateProgress() {
    return this.currentAmount && this.targetAmount 
      ? Math.round((this.currentAmount / this.targetAmount) * 100) 
      : 0;
  }

  // Método para determinar el estado del ahorro
  determineStatus() {
    const progress = this.calculateProgress();
    const daysRemaining = this.calculateDaysRemaining();

    if (progress >= 100) return 'completed';
    if (daysRemaining < 0) return 'failed';
    return 'in_progress';
  }

  // Calcular días restantes para la meta
  calculateDaysRemaining() {
    if (!this.targetDate) return 0;
    const today = new Date();
    const targetDate = new Date(this.targetDate);
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}

Savings.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  goalName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del objetivo no puede estar vacío'
      },
      len: {
        args: [2, 100],
        msg: 'El nombre del objetivo debe tener entre 2 y 100 caracteres'
      }
    }
  },
  targetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El monto objetivo debe ser mayor que 0'
      },
      isNumeric: {
        msg: 'El monto objetivo debe ser un número'
      }
    }
  },
  currentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'El monto actual no puede ser negativo'
      },
      isNumeric: {
        msg: 'El monto actual debe ser un número'
      }
    }
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      },
      isAfter: {
        args: [new Date().toISOString().split('T')[0]],
        msg: 'La fecha objetivo debe ser en el futuro'
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
  },
  status: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.determineStatus();
    }
  },
  progress: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.calculateProgress();
    }
  }
}, {
  sequelize,
  modelName: 'Savings',
  tableName: 'savings',
  timestamps: true,
  paranoid: true,
  hooks: {
    beforeValidate: (savings) => {
      // Asegurar que el monto actual no supere el monto objetivo
      if (savings.currentAmount > savings.targetAmount) {
        savings.currentAmount = savings.targetAmount;
      }
    }
  }
});

module.exports = Savings;