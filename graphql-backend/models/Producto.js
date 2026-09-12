const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  descripcion: { 
    type: DataTypes.STRING 
  },
  precio: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  }
});

module.exports = Producto;