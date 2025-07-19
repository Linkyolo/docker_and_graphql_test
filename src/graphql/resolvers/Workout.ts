import { Workout } from '../../entities/Workout';

export class WorkoutResolver {
        typeDefs = `
    type Workout {
      id: ID!
      name: String!
    }

    extend type Query {
      workouts: [Workout!]!
    }
  `;

        resolvers = {
                Query: {
                        workouts: async (_: any, __: any, { dataSource }) => {
                                return await dataSource.getRepository(Workout).find();
                        },
                },
        };
}
