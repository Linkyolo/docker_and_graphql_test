import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server";
import * as dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data-source";
import { UserResolver } from "./graphql/resolvers/User";
import { buildSchema } from "type-graphql";
import { WorkoutResolver } from "./graphql/resolvers/Workout";

async function main() {

        await AppDataSource.initialize()

        const schema = await buildSchema({
                resolvers: [UserResolver, WorkoutResolver], validate: false,
        })

        const server = new ApolloServer({ schema })
        const { url } = await server.listen({ port: 3000 })

        console.log(`🚀 Server ready at ${url}`);

}

main().catch((err) => { console.error("Error starting server", err) })
