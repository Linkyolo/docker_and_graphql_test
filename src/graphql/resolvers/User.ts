
import { User } from '../../entities/User';

export class UserResolver {
        typeDefs = `
    type User {
      id: ID!
      name: String!
    }

    extend type Query {
      users: [User!]!
    }
  `;

        resolvers = {
                Query: {
                        users: async (_: any, __: any, { dataSource }) => {
                                return await dataSource.getRepository(User).find();
                        },
                },
        };
}
