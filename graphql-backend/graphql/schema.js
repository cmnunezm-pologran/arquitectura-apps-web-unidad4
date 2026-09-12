const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Producto {
    id: ID!
    nombre: String!
    descripcion: String
    precio: Float!
  }

  type Query {
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!): Producto
  }

  type Mutation {
    crearProducto(nombre: String!, descripcion: String, precio: Float!): Producto
    actualizarProducto(id: ID!, nombre: String, descripcion: String, precio: Float): Producto
    eliminarProducto(id: ID!): String
  }
`;

module.exports = typeDefs;