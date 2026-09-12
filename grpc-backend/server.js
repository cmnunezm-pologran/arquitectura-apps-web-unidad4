const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const sequelize = require('./config/database');
const productoService = require('./services/productoService');

const PROTO_PATH = path.join(__dirname, 'proto', 'producto.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const productoProto = protoDescriptor.productos;

async function main() {
  await sequelize.sync({ force: false });
  console.log('Base de datos sincronizada para gRPC');

  const server = new grpc.Server();
  server.addService(productoProto.ProductoService.service, productoService);
  
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Servidor gRPC corriendo en puerto 50051');
    server.start();
  });
}

main();