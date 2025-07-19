import { User, Workout } from "./entities";
import { DataSource } from "typeorm";


export const AppDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || "postgres",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "postgres",
        synchronize: true,
        logging: false,
        entities: [User, Workout],
        migrations: [],
        subscribers: [],

})
