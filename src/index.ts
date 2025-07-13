import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    helloWorld: String
  }
`;

const resolvers = {
        Query: {
                helloWorld: () => 'Hello, world!'
        }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 3000 }).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
});
