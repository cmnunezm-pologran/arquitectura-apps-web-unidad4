process.env.NODE_ENV = 'test';
const request = require('supertest');
const startServer = require('./index');
const sequelize = require('./config/database'); // Ajusta esta ruta si es diferente

let app;

// Inicia el servidor antes de todas las pruebas
beforeAll(async () => {
  app = await startServer();
});

// Cierra la conexión a la base de datos al terminar
afterAll(async () => {
  await sequelize.close();
});

describe('Pruebas del API GraphQL', () => {
  test('Debe retornar un código 200 y una lista de productos', async () => {
    const respuesta = await request(app)
      .post('/graphql')
      .send({ query: '{ obtenerProductos { id nombre } }' });

    expect(respuesta.statusCode).toBe(200);
  });
});