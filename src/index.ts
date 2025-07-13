import "reflect-metadata";
import { DataSource } from "typeorm";
import { ApolloServer, gql } from "apollo-server";
import { User } from "./entities/User";
import * as dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || "postgres",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "postgres",
        synchronize: true,
        logging: false,
        entities: [User],
        migrations: [],
        subscribers: [],
});

const typeDefs = gql`
  type Query {
    helloWorld: String
  }
`;

const resolvers = {
        Query: {
                helloWorld: async () => {
                        const users = await AppDataSource.getRepository(User).find();
                        return `Hello, ${users.length} users in DB!`;
                },
        },
};

AppDataSource.initialize()
        .then(() => {
                const server = new ApolloServer({ typeDefs, resolvers });

                server.listen({ port: 3000 }).then(({ url }) => {
                        console.log(`🚀 Server ready at ${url}`);
                });
        })
        .catch((error: unknown) => {
                if (error instanceof Error) {
                        console.error("TypeORM connection error:", error.message);
                } else {
                        console.error("TypeORM connection error:", error);
                }
        });
