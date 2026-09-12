process.env.NODE_ENV = 'test';
const request = require('supertest');
const startServer = require('./index');
// Ajusta la ruta a tu archivo de configuración de Sequelize si es distinta
const sequelize = require('./config/database'); 

let app;
let productoId; // Guardaremos el ID generado para usarlo en las demás pruebas

beforeAll(async () => {
  app = await startServer();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Pruebas Completas CRUD del API GraphQL', () => {
  
  test('1. Debe CREAR un producto', async () => {
    const query = `
      mutation {
        crearProducto(nombre: "Dron DJI Mavic 3", descripcion: "Cámara Hasselblad 5.1K, 46 min vuelo", precio: 2199.99) {
          id
          nombre
        }
      }
    `;
    const respuesta = await request(app).post('/graphql').send({ query });
    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.data.crearProducto).toHaveProperty('id');
    
    // Capturamos el ID dinámico creado en la base de datos de prueba
    productoId = respuesta.body.data.crearProducto.id;
  });

  test('2. Debe LEER la lista completa de productos', async () => {
    const query = `{ obtenerProductos { id nombre } }`;
    const respuesta = await request(app).post('/graphql').send({ query });
    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(respuesta.body.data.obtenerProductos)).toBeTruthy();
  });

  test('3. Debe LEER el producto específico por su ID', async () => {
    const query = `{ obtenerProducto(id: "${productoId}") { nombre } }`;
    const respuesta = await request(app).post('/graphql').send({ query });
    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.data.obtenerProducto.nombre).toBe('Dron DJI Mavic 3');
  });

  test('4. Debe ACTUALIZAR el precio del producto', async () => {
    const query = `
      mutation {
        actualizarProducto(id: "${productoId}", precio: 150.0) {
          precio
        }
      }
    `;
    const respuesta = await request(app).post('/graphql').send({ query });
    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.data.actualizarProducto.precio).toBe(150.0);
  });

  test('5. Debe ELIMINAR el producto', async () => {
    const query = `
      mutation {
        eliminarProducto(id: "${productoId}")
      }
    `;
    const respuesta = await request(app).post('/graphql').send({ query });
    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.data.eliminarProducto).not.toBeNull();
  });
  test('6. Debe manejar el error al buscar un ID inexistente', async () => {
    const query = `{ obtenerProducto(id: "999999") { nombre } }`;
    const respuesta = await request(app).post('/graphql').send({ query });
    
    // Verifica que el servidor no haya crasheado (200) pero que incluya la propiedad nativa 'errors'
    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.errors).toBeDefined();
  });
  

});