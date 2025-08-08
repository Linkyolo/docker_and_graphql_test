import { User, Workout, Exercise } from "./entities";
import { DataSource } from "typeorm";
import 'dotenv/config';

export const AppDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || "postgres",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "postgres",
        synchronize: true,
        logging: false,
        // entities: ['dist/entities/**/*.js'],
        entities: [User, Workout, Exercise],
        migrations: ['dist/migrations/**/*.js'],
        subscribers: [],

})
