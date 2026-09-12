const grpc = require('@grpc/grpc-js');
const Producto = require('../models/Producto');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  Create: async (call, callback) => {
    try {
      const { nombre, descripcion, precio } = call.request;
      const producto = await Producto.create({ id: uuidv4(), nombre, descripcion, precio });
      callback(null, producto);
    } catch (error) {
      callback({ code: grpc.status.INTERNAL, details: "Error al crear producto" });
    }
  },
  Get: async (call, callback) => {
    try {
      const producto = await Producto.findByPk(call.request.id);
      if (!producto) return callback({ code: grpc.status.NOT_FOUND, details: "No encontrado" });
      callback(null, producto);
    } catch (error) { callback({ code: grpc.status.INTERNAL, details: "Error interno" }); }
  },
  Update: async (call, callback) => {
    try {
      const { id, nombre, descripcion, precio } = call.request;
      const producto = await Producto.findByPk(id);
      if (!producto) return callback({ code: grpc.status.NOT_FOUND, details: "No encontrado" });
      await producto.update({ nombre, descripcion, precio });
      callback(null, producto);
    } catch (error) { callback({ code: grpc.status.INTERNAL, details: "Error al actualizar" }); }
  },
  Delete: async (call, callback) => {
    try {
      const borrado = await Producto.destroy({ where: { id: call.request.id } });
      if (!borrado) return callback({ code: grpc.status.NOT_FOUND, details: "No encontrado" });
      callback(null, { id: call.request.id });
    } catch (error) { callback({ code: grpc.status.INTERNAL, details: "Error al eliminar" }); }
  },
  List: async (call, callback) => {
    try {
      const productos = await Producto.findAll();
      callback(null, { items: productos });
    } catch (error) { callback({ code: grpc.status.INTERNAL, details: "Error al listar" }); }
  }
};