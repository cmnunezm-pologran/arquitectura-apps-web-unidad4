const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const sequelize = require('./config/database');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  await sequelize.sync({ force: false });
  console.log('Base de datos sincronizada');

  if (process.env.NODE_ENV !== 'test') {
      app.listen(4000, () => {
        console.log(`Servidor GraphQL listo en http://localhost:4000${server.graphqlPath}`);
      });
    }
    
    return app;
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = startServer;