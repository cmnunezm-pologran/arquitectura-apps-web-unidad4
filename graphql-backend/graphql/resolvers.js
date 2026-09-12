const Producto = require('../models/Producto');

const resolvers = {
  Query: {
    obtenerProductos: async () => {
      try { return await Producto.findAll(); } 
      catch (error) { throw new Error("Error al obtener productos"); }
    },
    obtenerProducto: async (_, { id }) => {
      try { 
        const producto = await Producto.findByPk(id);
        if (!producto) throw new Error("Producto no encontrado");
        return producto;
      } catch (error) { throw new Error(error.message); }
    }
  },
  Mutation: {
    crearProducto: async (_, { nombre, descripcion, precio }) => {
      try { return await Producto.create({ nombre, descripcion, precio }); } 
      catch (error) { throw new Error("Error al crear el producto"); }
    },
    actualizarProducto: async (_, { id, nombre, descripcion, precio }) => {
      try {
        const producto = await Producto.findByPk(id);
        if (!producto) throw new Error("Producto no encontrado");
        await producto.update({ nombre, descripcion, precio });
        return producto;
      } catch (error) { throw new Error(error.message); }
    },
    eliminarProducto: async (_, { id }) => {
      try {
        const borrado = await Producto.destroy({ where: { id } });
        if (!borrado) throw new Error("Producto no encontrado");
        return "Producto eliminado correctamente";
      } catch (error) { throw new Error(error.message); }
    }
  }
};

module.exports = resolvers;